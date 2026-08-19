import { createDeepAgent, type DeepAgent, type SubAgent } from "deepagents";
import { env } from "node:process";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { ChatOpenRouter } from "@langchain/openrouter";
import { providerStrategy, toolStrategy } from "langchain";
import {
  ChartDataDTOSchema,
  createChartDataDTOSchema,
  CHART_TYPES,
  type ChartTypeLiteral,
} from "./chart-schemas";

const CHART_TYPE_GUIDANCE: Record<ChartTypeLiteral, string> = {
  bar: "Use for categorical comparisons. Data: array of numbers or [min, max] tuples. Supports grouped/stacked bars via multiple datasets.",
  line: "Use for continuous trends over time/ordered categories. Data: numbers or {x, y} objects. Supports tension/smoothing and fill areas.",
  scatter:
    "Use for correlation between two numeric variables. Data: {x, y} objects. No lines by default (showLine: false).",
  bubble:
    "Use for three-variable correlation. Data: {x, y, r} where r = bubble radius. Scale r appropriately for visibility.",
  pie: "Use for part-to-whole (single series). Data: array of numbers summing to 100%. Supports circumference/rotation for partial pies.",
  doughnut:
    "Like pie but with center cutout. Data: array of numbers. Supports cutout size (number or percentage string).",
  polarArea:
    "Like pie but equal angles, varying radius. Good for cyclic data (months, hours). Data: array of numbers.",
  radar:
    "Use for multi-dimensional comparison across axes. Data: array of numbers per dataset. Supports fill and lineTension.",
};

const CHART_FORMATTER_BASE_PROMPT = `You are a chart formatting agent for {TYPE} charts.

Given raw data and analysis from the wolfram-agent, transform it into a valid {TYPE} chart configuration.

Your output MUST include:
- query: the original user question
- toolCallsUsed: number of wolfram tool calls made (pass through from context)
- shortenedQuery: a re-phrased version of the question, <= 5 words
- dataset: ChartConfiguration with type="{TYPE}" and appropriate data/options

{GUIDANCE}

Output ONLY the structured chart DTO. Do not include explanatory text.`;

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
    systemPrompt: `You are a delegator agent designed to:
    1. delegate \`wolfram-agent\` to find answers to questions the user has asked
    2. analyze the returned data and determine the best chart type (bar, line, scatter, bubble, pie, doughnut, polarArea, radar)
    3. delegate the appropriate chart formatter subagent (\`{type}-formatter\`) to output the final chart configuration

    # Chart Type Selection Guidance
    - bar: categorical comparisons, rankings, distributions
    - line: trends over time, continuous sequences
    - scatter: correlation between two numeric variables
    - bubble: three-variable correlation (x, y, size)
    - pie/doughnut: part-to-whole, single series proportions
    - polarArea: cyclic data with magnitude (months, hours, seasons)
    - radar: multi-dimensional profiles across categories

    If the user explicitly requests a chart type, honor that request.

    # Notes
    In the final response schema:
    * query - the original question the user asked
    * shortenedQuery - a re-phrased version of that question, but <= 5 words
    * dataset - ChartConfiguration with type, data, and options
    * Agent MUST NOT Hallucinate results. Before collecting any data point, ensure the wolfram-agent is called.
      * Exception: user is asking to skip wolfram entirely

    # Output

    Designated output should *only* be what the formatter subagent has provided, nothing else.`,
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
        systemPrompt: `You are a wolfram alpha agent designed to gather information through designated tools that connect to wolfram.

      Given the data requested, run the minimum amount of queries necessary to gather the answer the user is looking for.

      Output should *only* include:
      * the answer data
      * amount of tool calls used to finish the query

      Tool calls will include a bunch of extra data, but the end-resulting output should be bare minimum`,
      } as SubAgent,
      ...chartFormatters,
    ],
  });

  return agent;
}
