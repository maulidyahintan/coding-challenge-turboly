"use client";

import type { TaskItem } from "@/features/task/types";
import { memo } from "react";

const priorityArticleClassName: Record<TaskItem["priority"], string> = {
  LOW: "border-emerald-200 bg-emerald-50 text-emerald-950",
  MEDIUM: "border-yellow-200 bg-yellow-50 text-yellow-950",
  HIGH: "border-rose-200 bg-rose-50 text-rose-950",
};

const priorityDetailButtonClassName: Record<TaskItem["priority"], string> = {
  LOW: "border-emerald-200/60 bg-emerald-100/60 text-emerald-900 hover:bg-emerald-100",
  MEDIUM: "border-yellow-200/60 bg-yellow-100/60 text-yellow-900 hover:bg-yellow-100",
  HIGH: "border-rose-200/60 bg-rose-100/60 text-rose-900 hover:bg-rose-100",
};

export const PreviewTaskCard = memo(function TaskCard({
  task,
  onDetail,
}: {
  task: TaskItem;
  onDetail: () => void;
}) {
  return (
    <article
      key={task.id}
      className={`rounded-lg border p-3 ${priorityArticleClassName[task.priority]}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="flex-1 truncate text-sm font-semibold">{task.title}</p>
        <button
          type="button"
          onClick={onDetail}
          className={`rounded-md border px-2 py-1 text-xs font-semibold transition ${priorityDetailButtonClassName[task.priority]}`}
        >
          Detail
        </button>
      </div>
      {task.description ? (
        <p className="mt-1 truncate text-xs opacity-80">{task.description}</p>
      ) : null}
    </article>
  );
});
