import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/ToolWorkspace";
import { TOOLS } from "@/lib/prompts";

const title = "Meeting Notes Summarizer — Synthetix";
const description =
  "Turn long meeting notes or transcripts into an executive summary, decisions, owners, deadlines and open risks.";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <ToolWorkspace spec={TOOLS.notes} />,
});
