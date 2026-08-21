"use client";

import { useEffect, useState } from "react";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { ResourceList } from "@/components/resources/ResourceList";
import { subscribeToPublishedResources } from "@/lib/firestore/resources";
import type { ResourceEntry } from "@/types";

export default function ResourcesPage() {
  const [items, setItems] = useState<ResourceEntry[]>([]);

  useEffect(() => {
    return subscribeToPublishedResources(setItems);
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <EyebrowLabel>Reference</EyebrowLabel>
      <h1 className="mt-1 text-xl font-medium text-foreground">Resource directory</h1>
      <p className="mt-2 text-sm text-muted">
        Offices and contacts by category. Confirm individualized questions directly with the
        listed office.
      </p>
      <div className="mt-6">
        <ResourceList items={items} />
      </div>
    </main>
  );
}
