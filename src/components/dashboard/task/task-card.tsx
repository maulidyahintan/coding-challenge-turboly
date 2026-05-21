import { CheckCircle2, Circle, Loader2, Pencil, Trash2 } from "lucide-react";
import { TaskItem } from "./types";
import { isOverdueDueDate } from "./utils";

const priorityBadgeStyle: Record<TaskItem["priority"], string> = {
  LOW: "bg-emerald-100 text-emerald-700",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-rose-100 text-rose-700",
};

type TaskCardProps = Readonly<{
  task: TaskItem;
  onEdit: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
  onToggleComplete: (task: TaskItem) => void;
  isDeleting: boolean;
  isCompleting: boolean;
}>;

function getCompleteIcon(isCompleting: boolean, isCompleted: boolean) {
  if (isCompleting) {
    return <Loader2 size={16} className="animate-spin" />;
  }

  if (isCompleted) {
    return <CheckCircle2 size={16} className="text-emerald-600" />;
  }

  return <Circle size={16} />;
}

function getDescriptionClassName(isCompleted: boolean, isOverdue: boolean) {
  if (isCompleted) {
    return "mt-1 text-xs text-slate-400 line-through";
  }

  if (isOverdue) {
    return "mt-1 text-xs text-red-700";
  }

  return "mt-1 text-xs text-slate-600";
}

function getDueDateClassName(isCompleted: boolean, isOverdue: boolean) {
  if (isCompleted) {
    return "mt-2 text-xs text-slate-400";
  }

  if (isOverdue) {
    return "mt-2 text-xs font-medium text-red-700";
  }

  return "mt-2 text-xs text-slate-500";
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
  isDeleting,
  isCompleting,
}: TaskCardProps) {
  const isOverdue = !task.completed && isOverdueDueDate(task.dueDate);
  const isActionDisabled = isDeleting || isCompleting;
  const completeIcon = getCompleteIcon(isCompleting, task.completed);
  const descriptionClassName = getDescriptionClassName(task.completed, isOverdue);
  const dueDateClassName = getDueDateClassName(task.completed, isOverdue);
  const completeButtonClassName = task.completed
    ? "mt-0.5 rounded-full bg-emerald-100 p-0.5 text-emerald-700 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-70"
    : "mt-0.5 rounded-full p-0.5 text-slate-600 transition hover:border-emerald-400 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <article
      className={
        isOverdue
          ? "rounded-lg border border-red-300 bg-red-50 p-3 text-red-900"
          : "rounded-lg border border-slate-200 bg-white p-3 text-slate-800"
      }
    >
      <div className="flex gap-3 items-start">
        <button
          type="button"
          onClick={() => onToggleComplete(task)}
          disabled={isActionDisabled}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as completed"}
          className={completeButtonClassName}
        >
          {completeIcon}
        </button>
        <div className="flex flex-col flex-1">
          <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
            <h3
              className={
                task.completed
                  ? "text-sm font-semibold leading-snug text-slate-500 line-through"
                  : "text-sm font-semibold leading-snug"
              }
            >
              {task.title}
            </h3>

            <div className="flex shrink-0 flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(task)}
                  disabled={isActionDisabled}
                  aria-label="Edit task"
                  className="rounded-md border border-slate-300 p-1.5 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(task)}
                  disabled={isActionDisabled}
                  aria-label="Delete task"
                  className="rounded-md border border-rose-300 p-1.5 text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isDeleting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {task.description ? <p className={descriptionClassName}>{task.description}</p> : null}

          <div className="flex justify-between gap-3">
            <p className={dueDateClassName}>
              Due {new Date(task.dueDate).toLocaleDateString()}
              {isOverdue ? " (Overdue)" : ""}
            </p>
            <span
              className={`rounded-full px-2 py-1 text-[11px] font-semibold ${priorityBadgeStyle[task.priority]}`}
            >
              {task.priority}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
