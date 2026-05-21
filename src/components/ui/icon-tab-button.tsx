import type { LucideIcon } from "lucide-react";

type IconTabButtonProps = Readonly<{
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
  ariaLabel: string;
  variant: "sidebar" | "bottom-nav";
  isExpanded?: boolean;
}>;

export function IconTabButton({
  icon: Icon,
  label,
  isActive,
  onClick,
  ariaLabel,
  variant,
  isExpanded = true,
}: IconTabButtonProps) {
  const activeClassName = isActive ? "bg-sky-400/60 text-sky-50" : "bg-sky-100/10 text-sky-100/85";

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={`inline-flex h-9 items-center rounded-lg transition ${isExpanded ? "w-full justify-start gap-2 px-3" : "w-9 justify-center"} ${activeClassName}`}
      >
        <Icon size={16} />
        {isExpanded ? <span className="text-sm font-semibold">{label}</span> : null}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex flex-1 flex-col items-center rounded-lg py-2 text-[10px] font-semibold transition ${
        isActive ? "bg-sky-100/25 text-sky-50" : "text-sky-100/75"
      }`}
    >
      <Icon size={15} className="mb-0.5" />
      {label}
    </button>
  );
}
