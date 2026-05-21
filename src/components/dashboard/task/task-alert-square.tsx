import {
  CalendarClock,
  CheckCheck,
  CircleAlert,
  Layers3,
  ListTodo,
  type LucideIcon,
} from "lucide-react";

export type TaskAlertTone = "dueToday" | "overdue" | "open" | "completed" | "all";

type TaskAlertSquareProps = Readonly<{
  count: number;
  tone: TaskAlertTone;
  isActive: boolean;
  onClick: () => void;
  forceActiveStyle?: boolean;
  alwaysShowView?: boolean;
  isMobileView?: boolean;
  fillWidth?: boolean;
}>;

const toneColors: Record<TaskAlertTone, string> = {
  dueToday: "var(--task-alert-due-today)",
  overdue: "var(--task-alert-overdue)",
  open: "var(--task-alert-open)",
  completed: "var(--task-alert-completed)",
  all: "var(--task-alert-all)",
};

const toneLabels: Record<TaskAlertTone, string> = {
  dueToday: "Today",
  overdue: "Overdue",
  open: "Open",
  completed: "Completed",
  all: "All Tasks",
};

const toneIcons: Record<TaskAlertTone, LucideIcon> = {
  dueToday: CalendarClock,
  overdue: CircleAlert,
  open: ListTodo,
  completed: CheckCheck,
  all: Layers3,
};

export function TaskAlertSquare({
  count,
  tone,
  isActive,
  onClick,
  forceActiveStyle = false,
  alwaysShowView = false,
  isMobileView = false,
  fillWidth = false,
}: TaskAlertSquareProps) {
  const ToneIcon = toneIcons[tone];
  const useActiveStyle = forceActiveStyle || isActive;
  const shouldStackIconOverView = isMobileView && toneLabels[tone].length > 8;
  const shouldShowView = !isActive || alwaysShowView;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`${toneLabels[tone]} tasks: ${count}`}
      className={`flex h-24 cursor-pointer flex-col justify-between rounded-lg border border-white/35 p-3 text-left text-white shadow-sm ${useActiveStyle ? "ring-2 ring-white/45" : ""} ${fillWidth ? "w-full" : "flex-1"}`}
      style={{ backgroundColor: toneColors[tone] }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wide opacity-90">{toneLabels[tone]}</p>
        {shouldStackIconOverView ? null : (
          <span
            className={`rounded-md p-1 ring-1 ${
              useActiveStyle ? "bg-white/20 ring-white/40" : "bg-white/15 ring-white/35"
            }`}
          >
            <ToneIcon size={16} className="text-white" />
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-2">
        <p className="text-3xl font-bold tabular-nums">{count}</p>
        <div className="flex flex-col items-end gap-1">
          {shouldStackIconOverView ? (
            <span
              className={`rounded-md p-1 ring-1 ${useActiveStyle ? "bg-white/20 ring-white/40" : "bg-white/15 ring-white/35"}`}
            >
              <ToneIcon size={16} className="text-white" />
            </span>
          ) : null}
          {shouldShowView ? (
            <span className="rounded-md bg-white/20 px-2 py-1 text-[11px] font-semibold text-white shadow-sm transition hover:bg-white/35">
              View
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
