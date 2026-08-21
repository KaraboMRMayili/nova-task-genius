import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/ToolWorkspace";
import { TOOLS } from "@/lib/prompts";

const title = "AI Task Planner — Synthetix";
const description =
  "Turn a messy backlog into a prioritized, time-blocked daily or weekly schedule with realistic buffers.";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <ToolWorkspace spec={TOOLS.planner} />,
});
