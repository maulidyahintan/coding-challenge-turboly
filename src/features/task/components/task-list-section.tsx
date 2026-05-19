import { TaskCard } from "@/features/task/components/task-card";
import { TaskItem, TaskSortOption } from "@/features/task/types";

type TaskListSectionProps = Readonly<{
  tasks: TaskItem[];
  isLoading: boolean;
  errorMessage: string | null;
  totalOpenTasks: number;
  sortBy: TaskSortOption;
  titleFilter: string;
  deletingTaskId: string | null;
  completingTaskId: string | null;
  onSortChange: (sortBy: TaskSortOption) => void;
  onTitleFilterChange: (query: string) => void;
  onEditTask: (task: TaskItem) => void;
  onDeleteTask: (task: TaskItem) => void;
  onToggleCompleteTask: (task: TaskItem) => void;
}>;

export function TaskListSection({
  tasks,
  isLoading,
  errorMessage,
  totalOpenTasks,
  sortBy,
  titleFilter,
  deletingTaskId,
  completingTaskId,
  onSortChange,
  onTitleFilterChange,
  onEditTask,
  onDeleteTask,
  onToggleCompleteTask,
}: TaskListSectionProps) {
  return (
    <div className="flex-1 overflow-hidden p-4 font-sans">
      <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-sky-200/25 bg-sky-950/45 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-sky-100/80">
            Tasks
          </h2>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-sky-100/75" htmlFor="task-title-filter">
              Search
            </label>
            <input
              id="task-title-filter"
              value={titleFilter}
              onChange={(event) => onTitleFilterChange(event.target.value)}
              placeholder="Search by title or desc..."
              className="w-40 rounded-md border border-sky-100/20 bg-sky-900/70 px-2 py-1 text-xs font-medium text-sky-50 outline-none placeholder:text-sky-200/50 focus:border-sky-300"
            />
            <label className="text-xs font-medium text-sky-100/75" htmlFor="task-sort-select">
              Sort by
            </label>
            <select
              id="task-sort-select"
              value={sortBy}
              onChange={(event) => onSortChange(event.target.value as TaskSortOption)}
              className="rounded-md border border-sky-100/20 bg-sky-900/70 px-2 py-1 text-xs font-medium text-sky-50 outline-none focus:border-sky-300"
            >
              <option value="dueDate">Due date</option>
              <option value="title">Title</option>
              <option value="description">Description</option>
              <option value="priority">Priority</option>
            </select>
            <span className="rounded-full bg-sky-100/15 px-2 py-1 text-xs font-medium text-sky-100">
              Open: {totalOpenTasks}
            </span>
          </div>
        </div>

        {errorMessage ? (
          <p className="mb-3 rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
          {isLoading ? (
            <p className="rounded-lg bg-white/80 px-3 py-2 text-sm text-slate-600">
              Loading tasks...
            </p>
          ) : null}

          {!isLoading && tasks.length === 0 ? (
            <p className="rounded-lg bg-white/80 px-3 py-2 text-sm text-slate-600">
              No task yet. Create your first task.
            </p>
          ) : null}

          {isLoading
            ? null
            : tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onToggleComplete={onToggleCompleteTask}
                  isDeleting={deletingTaskId === task.id}
                  isCompleting={completingTaskId === task.id}
                />
              ))}
        </div>
      </section>
    </div>
  );
}
