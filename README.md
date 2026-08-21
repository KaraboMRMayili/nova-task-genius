# AI Workplace Productivity Assistant (Synthetix)

A modern, responsive web app that helps professionals automate everyday workplace tasks with AI — drafting email, summarizing meetings, planning work, researching topics, and chatting with an assistant.

## Project overview

Synthetix is a SaaS-style dashboard with a persistent sidebar and a dedicated workspace for each AI tool. Every tool follows the same contract: a **structured input brief** on the left, an **editable AI output panel** on the right, and a visible **responsible AI disclaimer**. Nothing is sent or stored on the user's behalf — the human stays in the loop.

## Features

| Feature | What it does |
| --- | --- |
| Smart Email Generator | Generates professional emails from recipient context, intent and facts. Tone control (formal, friendly, direct, persuasive, apologetic) and length control. |
| Meeting Notes Summarizer | Turns raw notes or a transcript into an executive summary, decisions, an action-item table with owners and due dates, plus risks and open questions. |
| AI Task Planner | Ranks a backlog on impact/urgency and produces a time-blocked daily or weekly schedule with buffer, deferrals and delegation suggestions. |
| AI Research Assistant | Summarizes a topic or pasted article into key insights, ranked recommendations and an explicit confidence/gaps section. |
| AI Chatbot | Streaming conversational workplace assistant with full conversation context, markdown rendering, suggested prompts and a stop control. |

Supporting capabilities: responsive layout (collapsible mobile nav + desktop sidebar), editable/copyable/regenerable outputs, markdown rendering, toast error handling for AI gateway failures, per-page SEO metadata.

### Prompt engineering

Prompts live in `src/lib/prompts.ts` and are assembled server-side, never in the browser. Each tool defines:

- a **system prompt** with a role, a strict output contract (named markdown sections/tables) and a shared safety clause;
- a **buildPrompt** function that injects the user's structured fields under labelled headings and gives the model explicit reasoning steps (e.g. "score each task on impact and urgency, then rank").

The shared safety clause forbids invented facts (placeholders such as `[CONFIRM DATE]` are required instead), demands a "Review before use" section, and blocks impersonation and professional-advice claims.

### Responsible AI practices

- Persistent disclaimer in the sidebar plus per-page disclaimers under every output.
- Outputs are always editable before use; the app never sends email or writes to calendars.
- The model marks unknown facts as placeholders and lists what a human must verify.
- No message or draft is persisted to a database; users are warned not to enter confidential data.
- A "Responsible AI practices" section on the dashboard explains human-in-the-loop, transparency and data minimisation.

## Tools used

- **TanStack Start** (React 19, TanStack Router, file-based routing, server functions)
- **Vite 7** build tooling
- **Tailwind CSS v4** with a semantic OKLCH design-token system in `src/styles.css`
- **shadcn/ui** + **lucide-react** + **sonner**
- **Vercel AI SDK** (`ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`) over the **Lovable AI Gateway**
- Model: `google/gemini-3.7-flash`
- **react-markdown** for rendering AI output

## Project structure

```
src/
  components/AppShell.tsx      Sidebar nav, mobile nav, page shell, disclaimer
  components/ToolWorkspace.tsx Shared input/output workspace for the 4 form tools
  lib/prompts.ts               Tool specs + structured prompt templates
  lib/ai-gateway.server.ts     Lovable AI Gateway provider helper
  lib/ai.server.ts             Server-only generation logic
  lib/ai.functions.ts          Typed server function called by the UI
  routes/index.tsx             Dashboard
  routes/email|notes|planner|research.tsx
  routes/chat.tsx              Streaming chatbot UI
  routes/api/chat.ts           Streaming chat endpoint
```

## Setup instructions

```bash
bun install      # or npm install
bun run dev      # starts the dev server on http://localhost:8080
bun run build    # production build
```

The AI key (`LOVABLE_API_KEY`) is provisioned automatically by Lovable Cloud and is read server-side only — it is never exposed to the browser.

## Team members

- Karabo Ramolobeng Mayili
