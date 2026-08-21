"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { ReviewedStamp } from "@/components/ui/ReviewedStamp";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { isExpired } from "@/lib/firestore/matrix";
import { subscribeToPublishedNavigateItems } from "@/lib/firestore/navigate";
import type { NavigateCategory, NavigateItem } from "@/types";

const categoryOrder: NavigateCategory[] = ["Monthly resource", "Session material", "Bridge to Intake"];

export default function NavigatePage() {
  const [items, setItems] = useState<NavigateItem[]>([]);

  useEffect(() => subscribeToPublishedNavigateItems(setItems), []);

  const grouped = categoryOrder
    .map((category) => ({ category, entries: items.filter((i) => i.category === category) }))
    .filter((group) => group.entries.length > 0);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <EyebrowLabel>Program pillar</EyebrowLabel>
      <h1 className="mt-1 text-xl font-medium text-foreground">Navigate</h1>
      <p className="mt-2 text-sm text-muted">
        Monthly resources, session materials, and the Bridge to Intake orientation packet for
        incoming cohorts.
      </p>

      <div className="mt-6 flex flex-col gap-8">
        {grouped.length === 0 ? (
          <p className="text-sm text-muted">No Navigate content published yet.</p>
        ) : (
          grouped.map(({ category, entries }) => (
            <section key={category}>
              <EyebrowLabel>{category}</EyebrowLabel>
              <div className="mt-2 flex flex-col gap-3">
                {entries.map((item) => {
                  const expired = isExpired(item.nextReviewDue);
                  return (
                    <Card key={item.id} className="flex flex-col gap-2 p-4">
                      <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                      {expired ? (
                        <DisclaimerBanner>
                          This item is under review. Confirm current details before relying on it.
                        </DisclaimerBanner>
                      ) : (
                        <>
                          <p className="text-sm text-muted">{item.description}</p>
                          {item.linkUrl && (
                            <a
                              href={item.linkUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-accent underline underline-offset-2"
                            >
                              View resource
                            </a>
                          )}
                        </>
                      )}
                      <ReviewedStamp date={item.lastReviewedDate} />
                    </Card>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </main>
  );
}
