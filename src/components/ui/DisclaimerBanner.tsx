import { ReactNode } from "react";

export function DisclaimerBanner({ children }: { children: ReactNode }) {
  return (
    <div className="border-l-2 border-accent bg-background px-4 py-3 text-sm text-muted">
      {children}
    </div>
  );
}
