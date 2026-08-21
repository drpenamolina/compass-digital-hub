import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { ReviewedStamp } from "@/components/ui/ReviewedStamp";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { SelfTrackCheckbox } from "@/components/matrix/SelfTrackCheckbox";
import { isExpired } from "@/lib/firestore/matrix";
import type { MatrixItem } from "@/types";

export function MatrixRowDetail({
  item,
  uid,
}: {
  item: MatrixItem;
  uid: string | null;
}) {
  const expired = isExpired(item.nextReviewDue);

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <EyebrowLabel>{item.transitionType}</EyebrowLabel>
          <h3 className="mt-1 text-base font-medium text-foreground">{item.title}</h3>
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          {item.pgyYears.map((year) => (
            <Badge key={year} tone="neutral">
              PGY-{year}
            </Badge>
          ))}
        </div>
      </div>

      {expired ? (
        <DisclaimerBanner>
          This item is under review. Confirm current requirements with the responsible office before acting.
        </DisclaimerBanner>
      ) : (
        <>
          <p className="text-sm text-foreground">{item.description}</p>
          <p className="text-sm text-muted">
            <span className="font-medium text-foreground">Applies when: </span>
            {item.triggerCondition}
          </p>
          <p className="text-sm text-muted">
            <span className="font-medium text-foreground">Action required: </span>
            {item.actionRequired}
          </p>
          <a
            href={item.authoritativeSourceLink}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-accent underline underline-offset-2"
          >
            View authoritative source
          </a>
        </>
      )}

      <div className="flex items-center justify-between border-t border-border pt-3">
        <ReviewedStamp date={item.lastReviewedDate} />
        {uid && !expired && (
          <SelfTrackCheckbox itemId={item.id} uid={uid} initialDone={Boolean(item.residentSelfTrack?.[uid])} />
        )}
      </div>
    </Card>
  );
}
