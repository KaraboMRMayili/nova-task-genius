import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const RunToolInput = z.object({
  tool: z.enum(["email", "notes", "planner", "research"]),
  values: z.record(z.string()),
});

export const runTool = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => RunToolInput.parse(input))
  .handler(async ({ data }) => {
    const { runToolOnGateway } = await import("./ai.server");
    return runToolOnGateway(data.tool, data.values);
  });
