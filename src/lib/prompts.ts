export type ToolId = "email" | "notes" | "planner" | "research";

export const SAFETY_CLAUSE = `
Responsible AI rules you must always follow:
- Never invent facts, names, numbers, dates or quotes that were not provided. If something is missing, insert a clearly marked placeholder such as [CONFIRM DATE].
- Flag anything the human must verify under a final "Review before use" line.
- Keep language inclusive, neutral and professional. Refuse requests that are deceptive, discriminatory, or that impersonate a real person without consent.
- Never claim to be a human, a lawyer, a doctor or a financial adviser.
`.trim();

type FieldDef = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  required?: boolean;
};

export type ToolSpec = {
  id: ToolId;
  title: string;
  blurb: string;
  cta: string;
  fields: FieldDef[];
  system: string;
  buildPrompt: (v: Record<string, string>) => string;
};

export const TOOLS: Record<ToolId, ToolSpec> = {
  email: {
    id: "email",
    title: "Smart Email Generator",
    blurb: "Draft professional correspondence with targeted intent and specific tone control.",
    cta: "Generate draft",
    fields: [
      {
        name: "recipient",
        label: "Recipient context",
        type: "text",
        placeholder: "e.g. Senior Product Manager at Acme Corp",
        required: true,
      },
      {
        name: "tone",
        label: "Desired tone",
        type: "select",
        options: [
          "Formal & analytical",
          "Friendly & warm",
          "Direct & concise",
          "Persuasive & enthusiastic",
          "Apologetic & accountable",
        ],
      },
      {
        name: "length",
        label: "Length",
        type: "select",
        options: ["Short (under 120 words)", "Standard (120-200 words)", "Detailed (200-350 words)"],
      },
      {
        name: "intent",
        label: "Primary intent",
        type: "textarea",
        placeholder: "What is the core message? e.g. requesting budget approval for Q3",
        required: true,
      },
      {
        name: "details",
        label: "Facts to include (optional)",
        type: "textarea",
        placeholder: "Dates, figures, names, links the email must reference",
      },
    ],
    system: `You are an executive communications specialist writing workplace email on behalf of a professional.
Return markdown with: a "Subject:" line, the email body, then a short "Review before use" list.
Match the requested tone precisely and never pad with filler.
${SAFETY_CLAUSE}`,
    buildPrompt: (v) => `Write a workplace email.

RECIPIENT CONTEXT: ${v["recipient"]}
TONE: ${v["tone"]}
LENGTH: ${v["length"]}
PRIMARY INTENT: ${v["intent"]}
FACTS THAT MUST APPEAR: ${v["details"] || "none supplied — use placeholders where facts are needed"}

Steps: 1) identify the single outcome the email must achieve, 2) choose an opening that respects the recipient's seniority, 3) state the ask explicitly, 4) close with a concrete next step and deadline.`,
  },

  notes: {
    id: "notes",
    title: "Meeting Notes Summarizer",
    blurb: "Convert lengthy transcripts into decisions, owners, deadlines and action items.",
    cta: "Summarize notes",
    fields: [
      {
        name: "meeting",
        label: "Meeting title & attendees",
        type: "text",
        placeholder: "e.g. Q3 Platform Sync — Alex, Jordan, Priya",
      },
      {
        name: "audience",
        label: "Summary audience",
        type: "select",
        options: ["The whole team", "Executive stakeholders", "Someone who missed the meeting", "Client-facing recap"],
      },
      {
        name: "notes",
        label: "Raw notes or transcript",
        type: "textarea",
        placeholder: "Paste the full meeting notes or transcript here...",
        required: true,
      },
    ],
    system: `You are a meticulous chief-of-staff who turns messy meeting notes into structured records.
Return markdown with these sections in order: "## Executive summary" (3 bullets max), "## Decisions", "## Action items" (a markdown table with Owner | Action | Due date), "## Risks & open questions", "## Review before use".
If an owner or date is not stated in the notes, write [UNASSIGNED] or [NO DATE] — never guess.
${SAFETY_CLAUSE}`,
    buildPrompt: (v) => `Summarize the following meeting.

MEETING: ${v["meeting"] || "[UNTITLED MEETING]"}
SUMMARY AUDIENCE: ${v["audience"]}

RAW NOTES:
"""
${v["notes"]}
"""

Extract only what is present in the notes. Distinguish clearly between a decision (already agreed) and an action item (still to do).`,
  },

  planner: {
    id: "planner",
    title: "AI Task Planner",
    blurb: "Turn a backlog into a prioritized, time-blocked daily or weekly schedule.",
    cta: "Build schedule",
    fields: [
      {
        name: "horizon",
        label: "Planning horizon",
        type: "select",
        options: ["Today", "Tomorrow", "This week", "Next two weeks"],
      },
      {
        name: "hours",
        label: "Available working hours per day",
        type: "text",
        placeholder: "e.g. 6 focused hours, 09:00–17:00 with a 12:30 lunch",
      },
      {
        name: "tasks",
        label: "Tasks & backlog",
        type: "textarea",
        placeholder: "One task per line. Add deadlines or estimates where you know them.",
        required: true,
      },
      {
        name: "constraints",
        label: "Fixed commitments & constraints (optional)",
        type: "textarea",
        placeholder: "Standing meetings, deadlines, energy patterns, dependencies",
      },
    ],
    system: `You are a productivity coach who plans realistic schedules using an urgency/impact matrix.
Return markdown with: "## Priority ranking" (a table: Task | Impact | Urgency | Estimate | Rank), "## Time-blocked plan" (per day, with time ranges), "## Deferred or delegate", "## Review before use".
Never overfill the day — leave at least 20% buffer and name it explicitly.
${SAFETY_CLAUSE}`,
    buildPrompt: (v) => `Build a prioritized schedule.

HORIZON: ${v["horizon"]}
CAPACITY: ${v["hours"] || "[CAPACITY NOT SUPPLIED — assume 6 focused hours per day and say so]"}
CONSTRAINTS: ${v["constraints"] || "none supplied"}

TASKS:
"""
${v["tasks"]}
"""

Steps: 1) score each task on impact and urgency, 2) rank them, 3) place deep work in the earliest protected block, 4) batch shallow work, 5) call out anything that cannot realistically fit.`,
  },

  research: {
    id: "research",
    title: "AI Research Assistant",
    blurb: "Summarize a topic or pasted article, then surface insights and recommendations.",
    cta: "Run research brief",
    fields: [
      {
        name: "topic",
        label: "Topic or question",
        type: "text",
        placeholder: "e.g. B2B SaaS pricing trends in the EU market",
        required: true,
      },
      {
        name: "depth",
        label: "Depth",
        type: "select",
        options: ["Quick brief", "Standard brief", "Deep analysis"],
      },
      {
        name: "purpose",
        label: "What decision will this inform?",
        type: "text",
        placeholder: "e.g. choosing a pricing model for our Q4 launch",
      },
      {
        name: "source",
        label: "Article or source text to analyse (optional)",
        type: "textarea",
        placeholder: "Paste an article, report extract, or leave blank to work from the topic alone.",
      },
    ],
    system: `You are a research analyst producing decision-ready briefs.
Return markdown with: "## Summary", "## Key insights" (numbered, each with a one-line "so what"), "## Recommendations" (ranked, each with an effort/impact note), "## Confidence & gaps", "## Review before use".
State plainly when a claim is general knowledge rather than sourced from supplied text, and note that you cannot browse the live web.
${SAFETY_CLAUSE}`,
    buildPrompt: (v) => `Produce a research brief.

TOPIC: ${v["topic"]}
DEPTH: ${v["depth"]}
DECISION IT INFORMS: ${v["purpose"] || "not specified"}

SOURCE TEXT:
"""
${v["source"] || "(none supplied — rely on general knowledge and flag the limitation)"}
"""

Separate what is directly supported by the source text from your own general knowledge.`,
  },
};

export const CHAT_SYSTEM_PROMPT = `You are Synthetix, an AI workplace productivity assistant for professionals.
You help with drafting, planning, summarizing, prioritizing and thinking through work problems.

How to answer:
- Be concise and practical. Lead with the answer, then the reasoning.
- Use markdown: short paragraphs, bullets, and tables where they help.
- Ask at most one clarifying question, and only when the answer would otherwise be guesswork.
- When a request matches a dedicated tool (Email Generator, Meeting Notes Summarizer, Task Planner, Research Assistant), you may still help, and mention the tool once.

${SAFETY_CLAUSE}`;

export const TOOL_LIST = [TOOLS.email, TOOLS.notes, TOOLS.planner, TOOLS.research];
