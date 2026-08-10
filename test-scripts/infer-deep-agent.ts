import { createWolframAgent } from "../utils/wolfram-agent";

const useStream = process.argv.includes("--stream");
const agent = await createWolframAgent();

const input = {
  messages: [
    {
      role: "user",
      content: "Which state is cheaper for gas? California, or Texas?",
    },
  ],
};

if (useStream) {
  // Verbose debug mode: stream every tool call and token as it happens
  const eventStream = await agent.streamEvents(input, { version: "v2" });

  let finalAnswerFromModel: string | undefined;
  let finalAnswerFromChain: unknown;

  for await (const event of eventStream) {
    switch (event.event) {
      case "on_tool_start":
        console.log(
          `[TOOL START] ${event.name}:`,
          JSON.stringify(event.data.input, null, 2),
        );
        break;

      case "on_tool_end":
        console.log(
          `[TOOL END] ${event.name}:`,
          JSON.stringify(event.data.output, null, 2),
        );
        break;

      case "on_chat_model_stream": {
        const chunk = event.data.chunk;
        const content =
          typeof chunk === "string"
            ? chunk
            : (chunk?.content ?? chunk?.text ?? "");
        if (content) {
          process.stdout.write(content);
        }
        break;
      }

      case "on_chat_model_end": {
        const output = event.data.output;
        const content =
          typeof output === "string"
            ? output
            : (output?.content ?? output?.text ?? "");
        if (content) {
          finalAnswerFromModel = content;
        }
        break;
      }

      case "on_chain_end":
        finalAnswerFromChain = event.data.output;
        break;
    }
  }

  console.log("\n\n=== FINAL ANSWER CANDIDATES ===");
  console.log("[from on_chat_model_end]:", finalAnswerFromModel);
  console.log(
    "[from on_chain_end]:",
    JSON.stringify(finalAnswerFromChain, null, 2),
  );
} else {
  // Default mode: simple invoke and print the final response
  const response = await agent.invoke(input);
  console.log("===STANDARD RESPONSE===", response);
  console.log(
    "===STRUCTURED RESPONSE===",
    JSON.stringify(response.structuredResponse, undefined, 4),
  );
}
