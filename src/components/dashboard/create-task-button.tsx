import { Plus } from "lucide-react";

type CreateTaskButtonProps = Readonly<{
  onClick?: () => void;
}>;

export function CreateTaskButton({ onClick }: CreateTaskButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg border border-sky-200/40 bg-sky-100/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-100/20"
    >
      <Plus size={16} />
      Add Task
    </button>
  );
}
