import { Card } from "@/components/ui/Card";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";

export default function NavigatePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <EyebrowLabel>Program pillar</EyebrowLabel>
      <h1 className="mt-1 text-xl font-medium text-foreground">Navigate</h1>
      <p className="mt-2 text-sm text-muted">
        Monthly resources, session materials, and the Bridge to Intake orientation packet for
        incoming cohorts.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <Card className="p-4 text-sm text-muted">Monthly resources — content coming soon.</Card>
        <Card className="p-4 text-sm text-muted">Session materials (N1–N4) — content coming soon.</Card>
        <Card className="p-4 text-sm text-muted">Bridge to Intake packet — content coming soon.</Card>
      </div>
    </main>
  );
}
