export type TaskAlertTone = "dueToday" | "overdue" | "open" | "completed" | "all";

type TaskAlertSquareProps = Readonly<{
  count: number;
  tone: TaskAlertTone;
}>;

const toneClasses: Record<TaskAlertTone, string> = {
  dueToday: "border-amber-300 bg-amber-50 text-amber-900",
  overdue: "border-rose-300 bg-rose-50 text-rose-900",
  open: "border-sky-300 bg-sky-50 text-sky-900",
  completed: "border-emerald-300 bg-emerald-50 text-emerald-900",
  all: "border-slate-300 bg-slate-50 text-slate-900",
};

const toneLabels: Record<TaskAlertTone, string> = {
  dueToday: "Due Today",
  overdue: "Overdue",
  open: "Open",
  completed: "Completed",
  all: "All Tasks",
};

export function TaskAlertSquare({ count, tone }: TaskAlertSquareProps) {
  return (
    <div
      className={`flex h-24 flex-1 flex-col justify-between rounded-lg border p-3 ${toneClasses[tone]}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{toneLabels[tone]}</p>
      <p className="text-3xl font-bold tabular-nums">{count}</p>
    </div>
  );
}
