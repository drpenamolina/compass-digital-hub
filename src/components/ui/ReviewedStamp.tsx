export function ReviewedStamp({ date }: { date: string }) {
  return (
    <span className="text-xs text-muted">
      Reviewed {new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
    </span>
  );
}
