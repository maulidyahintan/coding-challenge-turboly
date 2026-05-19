import { TaskItem } from "@/features/task/types";
import { TaskCard } from "@/features/task/components/task-card";

type TaskListSectionProps = Readonly<{
  tasks: TaskItem[];
  isLoading: boolean;
  errorMessage: string | null;
  totalOpenTasks: number;
  onEditTask: (task: TaskItem) => void;
}>;

export function TaskListSection({
  tasks,
  isLoading,
  errorMessage,
  totalOpenTasks,
  onEditTask,
}: TaskListSectionProps) {
  return (
    <div className="flex-1 overflow-hidden p-4 font-sans">
      <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-sky-200/25 bg-sky-950/45 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-sky-100/80">Tasks</h2>
          <span className="rounded-full bg-sky-100/15 px-2 py-1 text-xs font-medium text-sky-100">
            Open: {totalOpenTasks}
          </span>
        </div>

        {errorMessage ? (
          <p className="mb-3 rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700">{errorMessage}</p>
        ) : null}

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
          {isLoading ? (
            <p className="rounded-lg bg-white/80 px-3 py-2 text-sm text-slate-600">Loading tasks...</p>
          ) : null}

          {!isLoading && tasks.length === 0 ? (
            <p className="rounded-lg bg-white/80 px-3 py-2 text-sm text-slate-600">
              No task yet. Create your first task.
            </p>
          ) : null}

          {isLoading ? null : tasks.map((task) => <TaskCard key={task.id} task={task} onEdit={onEditTask} />)}
        </div>
      </section>
    </div>
  );
}
