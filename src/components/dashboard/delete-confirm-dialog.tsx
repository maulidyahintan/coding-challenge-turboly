type DeleteConfirmDialogProps = Readonly<{
  title?: string;
  description: string;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}>;

export function DeleteConfirmDialog({
  title = "Delete this task?",
  description,
  isPending,
  onCancel,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <div className="w-full max-w-sm rounded-xl border border-rose-200 bg-white p-4 shadow-xl">
      <p className="text-sm font-semibold text-rose-900">{title}</p>
      <p className="mt-1 text-xs text-rose-800">{description}</p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isPending}
          className="flex-1 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-rose-300"
        >
          {isPending ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
