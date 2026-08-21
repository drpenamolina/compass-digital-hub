import { formatDate } from "@/lib/date";

export function ReviewedStamp({ date }: { date: string }) {
  return <span className="text-xs text-muted">Reviewed {formatDate(date)}</span>;
}
