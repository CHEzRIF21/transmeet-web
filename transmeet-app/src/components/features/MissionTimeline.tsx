import type { MissionStatus } from "@/types/database.types";
import { cn } from "@/lib/utils";

const STEPS: { status: MissionStatus; label: string }[] = [
  { status: "pending", label: "En attente" },
  { status: "accepted", label: "Acceptée" },
  { status: "in_transit", label: "En cours" },
  { status: "delivered", label: "Livrée" },
  { status: "completed", label: "Terminée" },
];

interface MissionTimelineProps {
  status: MissionStatus;
  className?: string;
}

export function MissionTimeline({ status, className }: MissionTimelineProps) {
  const currentIndex = STEPS.findIndex((s) => s.status === status);

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium text-muted-foreground">Étapes</p>
      <ul className="flex flex-col gap-2">
        {STEPS.map((step, i) => {
          const done = i <= currentIndex;
          const current = i === currentIndex;
          return (
            <li
              key={step.status}
              className={cn(
                "flex items-center gap-3 rounded-md border px-3 py-2 text-sm",
                done && "border-primary/30 bg-primary/5",
                current && "ring-1 ring-primary"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                  done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                {done ? "✓" : i + 1}
              </span>
              <span className={done ? "text-foreground" : "text-muted-foreground"}>
                {step.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
