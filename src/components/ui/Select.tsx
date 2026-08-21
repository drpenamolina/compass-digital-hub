import { SelectHTMLAttributes } from "react";
import { IconChevronDown } from "@tabler/icons-react";

export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={`appearance-none rounded-lg border border-border px-3 py-2 pr-8 text-sm text-foreground outline-none focus:border-accent ${className}`}
        {...props}
      />
      <IconChevronDown
        size={16}
        stroke={1.5}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
}
