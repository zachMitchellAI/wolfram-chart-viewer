import { createDeepAgent, type DeepAgent, type SubAgent } from "deepagents";
import { env } from "node:process";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { ChatOpenRouter } from "@langchain/openrouter";
import { providerStrategy, toolStrategy } from "langchain";
import { ChartDataDTOSchema, createChartDataDTOSchema } from "./chart-schemas";
import { CHART_TYPES, type ChartTypeLiteral } from "./chart-types.interface";
import {
  CHART_TYPE_GUIDANCE,
  CHART_FORMATTER_BASE_PROMPT,
  WOLFRAM_DELEGATOR_PROMPT,
  WOLFRAM_SUBAGENT_PROMPT,
} from "./wolfram-agent.constants";

function createChartFormatterSubAgent(type: ChartTypeLiteral): SubAgent {
  const prompt = CHART_FORMATTER_BASE_PROMPT.replace("{TYPE}", type).replace(
    "{GUIDANCE}",
    CHART_TYPE_GUIDANCE[type],
  );
  const schema = createChartDataDTOSchema(type);
  return {
    name: `${type}-formatter`,
    description: `Format data as ${type} chart`,
    model: env["CHART_SUBAGENT"],
    systemPrompt: prompt,
    responseFormat: toolStrategy<typeof schema>(schema, {
      handleError: true,
    }),
  };
}

export async function createWolframAgent(): Promise<DeepAgent> {
  const wolfram = new MultiServerMCPClient({
    wolfram: {
      transport: "http",
      url: "https://agenttools.wolfram.com/mcp",
    },
  });

  console.warn("using:", env["CHART_MODEL"]);
  const model = new ChatOpenRouter(env["CHART_MODEL"] || "z-ai/glm-5.2");

  const chartFormatters = CHART_TYPES.map(createChartFormatterSubAgent);

  const agent = createDeepAgent({
    model,
    systemPrompt: WOLFRAM_DELEGATOR_PROMPT,
    permissions: [
      {
        operations: ["read", "write"],
        paths: ["/**"],
        mode: "deny",
      },
    ],
    responseFormat: providerStrategy(ChartDataDTOSchema),
    subagents: [
      {
        name: "wolfram-agent",
        description: "Run wolfram queries based on user requests",
        model: env["CHART_SUBAGENT"],
        tools: await wolfram.getTools(),
        systemPrompt: WOLFRAM_SUBAGENT_PROMPT,
      } as SubAgent,
      ...chartFormatters,
    ],
  });

  return agent;
}
