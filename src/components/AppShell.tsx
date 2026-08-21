import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  CalendarClock,
  LayoutDashboard,
  Mail,
  Menu,
  MessagesSquare,
  NotebookPen,
  Telescope,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Meeting Summaries", icon: NotebookPen },
  { to: "/planner", label: "Task Planner", icon: CalendarClock },
  { to: "/research", label: "Research Assistant", icon: Telescope },
  { to: "/chat", label: "AI Chatbot", icon: MessagesSquare },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-1 px-3">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-2.5 rounded-md py-2 pl-2 pr-3 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
          activeProps={{
            className: "bg-accent text-foreground font-medium ring-1 ring-border",
          }}
        >
          <Icon className="size-4 shrink-0" strokeWidth={1.75} />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function Disclaimer() {
  return (
    <div className="p-4">
      <div className="rounded-lg bg-accent/60 p-3 ring-1 ring-border">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Responsible AI</p>
        <p className="text-[11px] leading-normal text-muted-foreground">
          Outputs are AI-generated and may be inaccurate or incomplete. Review, edit and verify before sending or acting
          on them. Avoid entering confidential or personal data.
        </p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
        <span className="text-sm font-semibold tracking-tight">Synthetix</span>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          className="grid size-8 place-items-center rounded-md hover:bg-accent"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 top-[53px] z-20 flex flex-col overflow-y-auto bg-surface lg:hidden">
          <div className="py-4">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
          <Disclaimer />
        </div>
      )}

      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
          <div className="p-6">
            <span className="text-sm font-semibold uppercase tracking-tight opacity-40">Synthetix</span>
            <p className="mt-1 text-[11px] text-muted-foreground">Workplace AI</p>
          </div>
          <NavLinks />
          <div className="mt-auto">
            <Disclaimer />
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, blurb }: { title: string; blurb?: string }) {
  return (
    <header className="mb-8">
      <h1 className="text-balance text-2xl font-medium tracking-tight sm:text-3xl">{title}</h1>
      {blurb && <p className="mt-3 max-w-[62ch] text-pretty text-muted-foreground">{blurb}</p>}
    </header>
  );
}

export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("mx-auto max-w-7xl px-5 py-10 lg:px-12 lg:py-12", className)}>{children}</section>;
}
