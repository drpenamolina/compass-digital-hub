"use client";

import { useEffect, useState } from "react";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { MatrixTable } from "@/components/matrix/MatrixTable";
import { subscribeToPublishedMatrixItems } from "@/lib/firestore/matrix";
import { useAuth } from "@/lib/auth-context";
import type { MatrixItem } from "@/types";

export default function MatrixPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<MatrixItem[]>([]);

  useEffect(() => {
    return subscribeToPublishedMatrixItems(setItems);
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <EyebrowLabel>Core feature</EyebrowLabel>
      <h1 className="mt-1 text-xl font-medium text-foreground">Anticipatory Action Matrix</h1>
      <p className="mt-2 text-sm text-muted">
        Deadlines and required actions for travel documentation, visa renewal, licensure, and
        fellowship transitions. Filter by your PGY year below.
      </p>
      <div className="mt-6">
        <MatrixTable items={items} uid={user?.uid ?? null} />
      </div>
    </main>
  );
}
