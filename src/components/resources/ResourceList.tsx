import { Card } from "@/components/ui/Card";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { ReviewedStamp } from "@/components/ui/ReviewedStamp";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { isExpired } from "@/lib/firestore/matrix";
import type { ResourceCategory, ResourceEntry } from "@/types";

const categoryOrder: ResourceCategory[] = [
  "TPL / International Office",
  "GME resources",
  "J-1 / IMG institutional resources",
  "Mental health & EAP",
  "Legal aid / referral resources",
  "Emergency & after-hours contacts",
  "Financial & practical resources",
];

export function ResourceList({ items }: { items: ResourceEntry[] }) {
  const grouped = categoryOrder
    .map((category) => ({
      category,
      entries: items.filter((item) => item.category === category),
    }))
    .filter((group) => group.entries.length > 0);

  if (grouped.length === 0) {
    return <p className="text-sm text-muted">No resources published yet.</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      {grouped.map(({ category, entries }) => (
        <section key={category}>
          <EyebrowLabel>{category}</EyebrowLabel>
          <div className="mt-2 flex flex-col gap-3">
            {entries.map((entry) => {
              const expired = isExpired(entry.nextReviewDue);
              return (
                <Card key={entry.id} className="flex flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-medium text-foreground">{entry.name}</h3>
                      <p className="text-xs text-muted">{entry.roleOrOffice}</p>
                    </div>
                  </div>
                  {expired ? (
                    <DisclaimerBanner>
                      This entry is under review. Confirm contact details before relying on them.
                    </DisclaimerBanner>
                  ) : (
                    <>
                      <p className="text-sm text-foreground">{entry.whatTheyHelpWith}</p>
                      <p className="text-sm text-muted">{entry.contactMethods}</p>
                      {entry.hours && <p className="text-xs text-muted">Hours: {entry.hours}</p>}
                    </>
                  )}
                  <ReviewedStamp date={entry.lastReviewedDate} />
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
