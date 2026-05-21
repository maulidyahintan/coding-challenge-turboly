type DataStateMessageProps = Readonly<{
  kind: "loading" | "empty" | "error";
  message: string;
  className?: string;
}>;

const baseClassName = "rounded-md px-3 py-2 text-sm";

const kindClassName: Record<DataStateMessageProps["kind"], string> = {
  loading: "bg-white/90 text-slate-700",
  empty: "bg-white/90 text-slate-700",
  error: "bg-rose-100 text-rose-700",
};

export function DataStateMessage({ kind, message, className }: DataStateMessageProps) {
  const role = kind === "error" ? "alert" : "status";
  const live = kind === "error" ? "assertive" : "polite";

  return (
    <p role={role} aria-live={live} className={`${baseClassName} ${kindClassName[kind]} ${className ?? ""}`}>
      {message}
    </p>
  );
}