import { LabelHTMLAttributes, ReactNode } from "react";

type FormLabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  text: string;
  required?: boolean;
  children?: ReactNode;
};

export function FormLabel({
  text,
  required = false,
  children,
  className,
  ...props
}: FormLabelProps) {
  return (
    <label
      className={`block text-xs font-semibold uppercase tracking-[0.08em] text-slate-700 ${className ?? ""}`.trim()}
      {...props}
    >
      <span>
        {text}
        {required ? <span className="ml-1 text-rose-600">*</span> : null}
      </span>
      {children}
    </label>
  );
}
