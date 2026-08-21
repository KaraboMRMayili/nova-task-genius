import { streamText } from "ai";
import { CHAT_MODEL, createLovableAiGatewayProvider, requireLovableApiKey } from "./ai-gateway.server";
import { TOOLS, type ToolId } from "./prompts";

export async function runToolOnGateway(tool: ToolId, values: Record<string, string>) {
  const spec = TOOLS[tool];
  const gateway = createLovableAiGatewayProvider(requireLovableApiKey());

  const result = streamText({
    model: gateway(CHAT_MODEL),
    system: spec.system,
    prompt: spec.buildPrompt(values),
  });

  // Stream on the wire, but return the finished text to the caller.
  const text = await result.text;
  return { text };
}
