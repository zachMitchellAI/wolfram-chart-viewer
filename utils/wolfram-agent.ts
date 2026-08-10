import { createDeepAgent, type DeepAgent } from "deepagents";
import { env } from "node:process";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { ChatOpenRouter } from "@langchain/openrouter";
import { providerStrategy } from "langchain";
import { ChartDataDTOSchema } from "./chart-schemas";

export async function createWolframAgent(): Promise<DeepAgent> {
  const wolfram = new MultiServerMCPClient({
    wolfram: {
      transport: "http",
      url: "https://agenttools.wolfram.com/mcp",
    },
  });

  console.warn("using:", env["CHART_MODEL"]);
  const model = new ChatOpenRouter(env["CHART_MODEL"] || "z-ai/glm-5.2");

  // Langchain provides a very easy to use system to prompt the things you like! You can choose to have a simple agent system, or a deep agent, which is what we're using today
  const agent = await createDeepAgent({
    model,
    systemPrompt: `You are an agent wielding the keys to wolfram: a powerful database holding the secrets to all sorts of answers
      Please try to use the wolfram alpha tools for all questions & answers. Use only the minimum required tool calls before generating a response
      
      # Notes
      In the response schema:
      
      * query - the original question the user asked
      * shortenedQuery - a re-phrased version of that question, but <= 5 words`,
    tools: await wolfram.getTools(),
    permissions: [
      {
        operations: ["read", "write"],
        paths: ["/**"],
        mode: "deny",
      },
    ],
    // Provider strategey just means "if a provider (in our case openrouter) has the ability to convert the data once it's here, then convert it over".
    // The alternative is `toolProvider`, so a tool is added for the model itself to convert.
    responseFormat: providerStrategy(ChartDataDTOSchema),
  });

  return agent;
}
