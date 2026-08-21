import { createFileRoute } from "@tanstack/react-router";
import { ToolWorkspace } from "@/components/ToolWorkspace";
import { TOOLS } from "@/lib/prompts";

const title = "Smart Email Generator — Synthetix";
const description =
  "Draft professional workplace emails with controlled tone, length and intent, then edit the AI output before sending.";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <ToolWorkspace spec={TOOLS.email} />,
});
