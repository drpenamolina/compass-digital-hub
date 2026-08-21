import { Card } from "@/components/ui/Card";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";

const instruments = [
  "AAQ (Acceptance and Action Questionnaire)",
  "Brief Resilience Scale",
  "Self-Compassion Scale",
  "Perceived Stress Scale",
];

export default function CopePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <EyebrowLabel>Program pillar</EyebrowLabel>
      <h1 className="mt-1 text-xl font-medium text-foreground">Cope</h1>
      <p className="mt-2 text-sm text-muted">
        ACT session schedule (6 sessions over ~8 months) and links to external, validated
        self-report instruments. Scores are not collected in this hub.
      </p>

      <section className="mt-6">
        <h2 className="text-sm font-medium text-foreground">Session schedule</h2>
        <Card className="mt-2 p-4 text-sm text-muted">Schedule coming soon.</Card>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-foreground">Wellness self-check instruments</h2>
        <div className="mt-2 flex flex-col gap-2">
          {instruments.map((name) => (
            <Card key={name} className="p-4 text-sm text-muted">
              {name} — link provided by program admin.
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
