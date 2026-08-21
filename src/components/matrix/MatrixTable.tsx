"use client";

import { useMemo, useState } from "react";
import { MatrixRowDetail } from "@/components/matrix/MatrixRowDetail";
import type { MatrixItem, TransitionType } from "@/types";

const transitionTypes: TransitionType[] = [
  "Travel Documentation",
  "Visa/J-1 Renewal",
  "Licensure Step",
  "Fellowship Eligibility",
  "Waiver Planning",
  "Post-Residency Employment",
];

export function MatrixTable({ items, uid }: { items: MatrixItem[]; uid: string | null }) {
  const [pgyFilter, setPgyFilter] = useState<"all" | "1" | "2" | "3">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | TransitionType>("all");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesPgy = pgyFilter === "all" || item.pgyYears.includes(Number(pgyFilter) as 1 | 2 | 3);
      const matchesType = typeFilter === "all" || item.transitionType === typeFilter;
      return matchesPgy && matchesType;
    });
  }, [items, pgyFilter, typeFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <select
          value={pgyFilter}
          onChange={(e) => setPgyFilter(e.target.value as typeof pgyFilter)}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
        >
          <option value="all">All PGY years</option>
          <option value="1">PGY-1</option>
          <option value="2">PGY-2</option>
          <option value="3">PGY-3</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
        >
          <option value="all">All transition types</option>
          {transitionTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted">No matrix items match these filters yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((item) => (
            <MatrixRowDetail key={item.id} item={item} uid={uid} />
          ))}
        </div>
      )}
    </div>
  );
}
