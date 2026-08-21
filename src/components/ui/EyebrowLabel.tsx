import { HTMLAttributes } from "react";

export function EyebrowLabel({ className = "", ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`block text-[11px] font-medium uppercase tracking-widest text-muted ${className}`}
      {...props}
    />
  );
}
