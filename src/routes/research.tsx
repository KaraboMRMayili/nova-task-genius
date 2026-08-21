import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/ToolWorkspace";
import { TOOLS } from "@/lib/prompts";

const title = "AI Research Assistant — Synthetix";
const description =
  "Summarize a topic or pasted article into a decision-ready brief with key insights, recommendations and confidence gaps.";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <ToolWorkspace spec={TOOLS.research} />,
});
