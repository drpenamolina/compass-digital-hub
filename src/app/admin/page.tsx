"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { useAuth } from "@/lib/auth-context";
import { subscribeToAllMatrixItems } from "@/lib/firestore/matrix";
import { subscribeToAllResources } from "@/lib/firestore/resources";
import type { MatrixItem, ResourceEntry } from "@/types";

function reviewCounts(dueDates: string[]) {
  const now = new Date();
  const in30 = new Date();
  in30.setDate(in30.getDate() + 30);
  let overdue = 0;
  let dueSoon = 0;
  for (const due of dueDates) {
    const date = new Date(due);
    if (date < now) overdue += 1;
    else if (date < in30) dueSoon += 1;
  }
  return { overdue, dueSoon };
}

export default function AdminPage() {
  const { profile } = useAuth();
  const [matrixItems, setMatrixItems] = useState<MatrixItem[]>([]);
  const [resources, setResources] = useState<ResourceEntry[]>([]);

  useEffect(() => subscribeToAllMatrixItems(setMatrixItems), []);
  useEffect(() => subscribeToAllResources(setResources), []);

  const canEdit = profile?.role === "reviewer" || profile?.role === "admin";

  const counts = useMemo(() => {
    const dueDates = [
      ...matrixItems.map((i) => i.nextReviewDue),
      ...resources.map((r) => r.nextReviewDue),
    ];
    return reviewCounts(dueDates);
  }, [matrixItems, resources]);

  if (!canEdit) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="text-sm text-muted">This area is restricted to reviewers and admins.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <EyebrowLabel>Governance</EyebrowLabel>
      <h1 className="mt-1 text-xl font-medium text-foreground">Admin</h1>

      <section className="mt-6">
        <h2 className="text-sm font-medium text-foreground">Review queue</h2>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <Card className="p-4">
            <Badge tone="warning">{counts.overdue} overdue</Badge>
            <p className="mt-1 text-xs text-muted">Past next review due date</p>
          </Card>
          <Card className="p-4">
            <Badge tone="accent">{counts.dueSoon} due soon</Badge>
            <p className="mt-1 text-xs text-muted">Due within 30 days</p>
          </Card>
        </div>
      </section>

      <section className="mt-8 flex flex-col gap-3">
        <Link href="/admin/matrix">
          <Card className="p-4 transition-colors hover:border-accent/40">
            <span className="text-sm font-medium text-foreground">Matrix content</span>
            <p className="text-xs text-muted">Add, edit, and publish Anticipatory Action Matrix items</p>
          </Card>
        </Link>
        <Link href="/admin/resources">
          <Card className="p-4 transition-colors hover:border-accent/40">
            <span className="text-sm font-medium text-foreground">Resource directory content</span>
            <p className="text-xs text-muted">Add, edit, and publish directory entries</p>
          </Card>
        </Link>
        <Card className="p-4 text-sm text-muted">Audit log — coming soon.</Card>
      </section>
    </main>
  );
}
