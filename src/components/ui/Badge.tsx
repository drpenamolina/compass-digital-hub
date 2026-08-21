import { HTMLAttributes } from "react";

type BadgeTone = "neutral" | "accent" | "warning";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-background text-muted border-border",
  accent: "bg-background text-accent border-accent/30",
  warning: "bg-background text-amber-700 border-amber-300",
};

export function Badge({
  tone = "neutral",
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${toneClasses[tone]} ${className}`}
      {...props}
    />
  );
}
