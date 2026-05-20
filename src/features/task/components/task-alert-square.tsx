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

const toneClasses: Record<TaskAlertTone, string> = {
  dueToday: "border border-amber-200 bg-amber-50 text-amber-700",
  overdue: "border border-rose-200 bg-rose-50 text-rose-700",
  open: "border border-sky-200 bg-sky-50 text-sky-700",
  completed: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  all: "border border-slate-200 bg-slate-50 text-slate-700",
};

const activeToneClasses: Record<TaskAlertTone, string> = {
  dueToday: "border border-amber-400 bg-amber-300 text-amber-950 shadow-sm",
  overdue: "border border-rose-400 bg-rose-300 text-rose-950 shadow-sm",
  open: "border border-sky-400 bg-sky-300 text-sky-950 shadow-sm",
  completed: "border border-emerald-400 bg-emerald-300 text-emerald-950 shadow-sm",
  all: "border border-slate-400 bg-slate-300 text-slate-950 shadow-sm",
};

const toneViewButtonClassName: Record<TaskAlertTone, string> = {
  dueToday:
    "bg-amber-300 text-amber-950 shadow-sm transition-all duration-200 hover:bg-amber-400 active:scale-[0.98]",
  overdue:
    "bg-rose-300 text-rose-950 shadow-sm transition-all duration-200 hover:bg-rose-400 active:scale-[0.98]",
  open: "bg-sky-300 text-sky-950 shadow-sm transition-all duration-200 hover:bg-sky-400 active:scale-[0.98]",
  completed:
    "bg-emerald-300 text-emerald-950 shadow-sm transition-all duration-200 hover:bg-emerald-400 active:scale-[0.98]",
  all: "bg-slate-300 text-slate-950 shadow-sm transition-all duration-200 hover:bg-slate-400 active:scale-[0.98]",
};

const toneLabels: Record<TaskAlertTone, string> = {
  dueToday: "Due Today",
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

const toneIconClassName: Record<TaskAlertTone, string> = {
  dueToday: "text-amber-700",
  overdue: "text-rose-700",
  open: "text-sky-700",
  completed: "text-emerald-700",
  all: "text-slate-700",
};

const activeToneIconClassName: Record<TaskAlertTone, string> = {
  dueToday: "text-amber-50",
  overdue: "text-rose-50",
  open: "text-sky-50",
  completed: "text-emerald-50",
  all: "text-slate-50",
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
      className={`flex h-24 cursor-pointer flex-col justify-between rounded-lg p-3 text-left ${fillWidth ? "w-full" : "flex-1"} ${toneClasses[tone]} ${useActiveStyle ? activeToneClasses[tone] : "bg-white"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wide opacity-70">{toneLabels[tone]}</p>
        {shouldStackIconOverView ? null : (
          <span
            className={`rounded-md p-1 ring-1 ${
              useActiveStyle ? "bg-black/20 ring-white/25" : "bg-white/90 ring-black/10"
            }`}
          >
            <ToneIcon
              size={16}
              className={useActiveStyle ? activeToneIconClassName[tone] : toneIconClassName[tone]}
            />
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-2">
        <p className="text-3xl font-bold tabular-nums">{count}</p>
        <div className="flex flex-col items-end gap-1">
          {shouldStackIconOverView ? (
            <span
              className={`rounded-md p-1 ring-1 ${
                useActiveStyle ? "bg-black/20 ring-white/25" : "bg-white/90 ring-black/10"
              }`}
            >
              <ToneIcon
                size={16}
                className={useActiveStyle ? activeToneIconClassName[tone] : toneIconClassName[tone]}
              />
            </span>
          ) : null}
          {shouldShowView ? (
            <span
              className={`rounded-md px-2 py-1 text-[11px] font-semibold transition ${toneViewButtonClassName[tone]}`}
            >
              View
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
