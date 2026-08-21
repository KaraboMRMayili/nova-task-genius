import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Copy, Loader2, RefreshCw, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { runTool } from "@/lib/ai.functions";
import type { ToolSpec } from "@/lib/prompts";
import { PageHeader, PageShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function initialValues(spec: ToolSpec) {
  const v: Record<string, string> = {};
  for (const f of spec.fields) v[f.name] = f.type === "select" ? (f.options?.[0] ?? "") : "";
  return v;
}

export function ToolWorkspace({ spec }: { spec: ToolSpec }) {
  const run = useServerFn(runTool);
  const [values, setValues] = useState(() => initialValues(spec));
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const setField = (name: string, value: string) => setValues((prev) => ({ ...prev, [name]: value }));

  const missing = spec.fields.filter((f) => f.required && !values[f.name]?.trim());

  const generate = async () => {
    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.map((f) => f.label).join(", ")}`);
      return;
    }
    setLoading(true);
    setEditing(false);
    try {
      const result = await run({ data: { tool: spec.id, values } });
      setOutput(result.text);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Generation failed";
      toast.error(message.includes("402") ? "AI credits exhausted for this workspace." : message);
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <PageShell>
      <PageHeader title={spec.title} blurb={spec.blurb} />

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
        <div className="space-y-5">
          {spec.fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label
                htmlFor={field.name}
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {field.label}
              </Label>
              {field.type === "text" && (
                <Input
                  id={field.name}
                  value={values[field.name] ?? ""}
                  placeholder={field.placeholder}
                  onChange={(e) => setField(field.name, e.target.value)}
                  className="bg-elevated"
                />
              )}
              {field.type === "textarea" && (
                <Textarea
                  id={field.name}
                  rows={field.name === "notes" || field.name === "source" ? 10 : 4}
                  value={values[field.name] ?? ""}
                  placeholder={field.placeholder}
                  onChange={(e) => setField(field.name, e.target.value)}
                  className="resize-none bg-elevated"
                />
              )}
              {field.type === "select" && (
                <select
                  id={field.name}
                  value={values[field.name] ?? ""}
                  onChange={(e) => setField(field.name, e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-elevated px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  {field.options?.map((option) => <option key={option}>{option}</option>)}
                </select>
              )}
            </div>
          ))}

          <Button onClick={generate} disabled={loading} className="w-full">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Generating…" : spec.cta}
          </Button>

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Prompts are structured server-side with role, constraints and responsible-AI rules before reaching the
            model.
          </p>
        </div>

        <div className="relative">
          <span className="absolute -top-3 left-6 rounded bg-primary px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary-foreground">
            AI Output
          </span>
          <div className="min-h-[420px] rounded-2xl bg-muted/40 p-6 ring-1 ring-border sm:p-8">
            {loading && (
              <div className="flex h-[340px] flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" />
                <p className="text-sm">Composing a structured draft…</p>
              </div>
            )}

            {!loading && !output && (
              <div className="flex h-[340px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border px-6 text-center">
                <Sparkles className="size-5 text-muted-foreground" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground">
                  Fill in the brief on the left and generate. Output appears here and stays fully editable.
                </p>
              </div>
            )}

            {!loading && output && (
              <>
                {editing ? (
                  <Textarea
                    value={output}
                    onChange={(e) => setOutput(e.target.value)}
                    className="min-h-[340px] resize-y bg-elevated font-mono text-xs leading-relaxed"
                  />
                ) : (
                  <div className="ai-prose">
                    <ReactMarkdown>{output}</ReactMarkdown>
                  </div>
                )}

                <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
                  <Button variant="outline" size="sm" onClick={() => setEditing((v) => !v)}>
                    {editing ? "Preview" : "Edit output"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={copy}>
                    {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={generate}>
                    <RefreshCw className="size-3.5" />
                    Regenerate
                  </Button>
                </div>
              </>
            )}
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
            AI-generated content. Verify facts, figures and names before sending.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
