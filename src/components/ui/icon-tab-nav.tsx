import type { LucideIcon } from "lucide-react";

import { IconTabButton } from "./icon-tab-button";

export type IconTabNavItem<TTab extends string> = Readonly<{
  tab: TTab;
  label: string;
  ariaLabel: string;
  icon: LucideIcon;
}>;

type IconTabNavProps<TTab extends string> = Readonly<{
  items: ReadonlyArray<IconTabNavItem<TTab>>;
  activeTab: TTab;
  onTabChange: (tab: TTab) => void;
  ariaLabel: string;
  className?: string;
  variant: "sidebar" | "bottom-nav";
  isExpanded?: boolean;
}>;

export function IconTabNav<TTab extends string>({
  items,
  activeTab,
  onTabChange,
  ariaLabel,
  className,
  variant,
  isExpanded,
}: IconTabNavProps<TTab>) {
  return (
    <nav className={className} aria-label={ariaLabel}>
      {items.map((item) => (
        <IconTabButton
          key={item.tab}
          icon={item.icon}
          label={item.label}
          isActive={activeTab === item.tab}
          onClick={() => onTabChange(item.tab)}
          ariaLabel={item.ariaLabel}
          variant={variant}
          isExpanded={isExpanded}
        />
      ))}
    </nav>
  );
}
