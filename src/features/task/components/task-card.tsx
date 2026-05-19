import { TaskItem } from "@/features/task/types";
import { isOverdueDueDate } from "@/features/task/utils";
import { Loader2, Pencil, Trash2 } from "lucide-react";

const priorityBadgeStyle: Record<TaskItem["priority"], string> = {
  LOW: "bg-emerald-100 text-emerald-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-rose-100 text-rose-700",
};

type TaskCardProps = Readonly<{
  task: TaskItem;
  onEdit: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
  isDeleting: boolean;
}>;

export function TaskCard({ task, onEdit, onDelete, isDeleting }: TaskCardProps) {
  const isOverdue = !task.completed && isOverdueDueDate(task.dueDate);

  return (
    <article
      className={
        isOverdue
          ? "rounded-lg border border-rose-300 bg-rose-50 p-3 text-rose-900"
          : "rounded-lg border border-slate-200 bg-white p-3 text-slate-800"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-snug">{task.title}</h3>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(task)}
              disabled={isDeleting}
              aria-label="Edit task"
              className="rounded-md border border-slate-300 p-1.5 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(task)}
              disabled={isDeleting}
              aria-label="Delete task"
              className="rounded-md border border-rose-300 p-1.5 text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            </button>
          </div>
        </div>
      </div>
      {task.description ? (
        <p className={isOverdue ? "mt-1 text-xs text-rose-700" : "mt-1 text-xs text-slate-600"}>
          {task.description}
        </p>
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <p className={isOverdue ? "mt-2 text-xs font-medium text-rose-700" : "mt-2 text-xs text-slate-500"}>
            Due {new Date(task.dueDate).toLocaleDateString()}
            {isOverdue ? " (Overdue)" : ""}
        </p>
        <span
            className={`rounded-full px-2 py-1 text-[11px] font-semibold ${priorityBadgeStyle[task.priority]}`}
          >
            {task.priority}
          </span>
        </div>
    </article>
  );
}
