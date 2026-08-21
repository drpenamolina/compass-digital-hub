import { Card } from "@/components/ui/Card";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";

const steps = [
  "Resident — assess the situation and your immediate needs.",
  "Buddy group — reach out to your cross-PGY buddy group for same-day support.",
  "TPL / Institutional contact — escalate to the Training Program Liaison or International Office for guidance.",
  "Emergency family contact — notified when the situation is serious enough to require it.",
];

export default function RestorePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <EyebrowLabel>Program pillar</EyebrowLabel>
      <h1 className="mt-1 text-xl font-medium text-foreground">Restore — Buddy system</h1>

      <section className="mt-6">
        <h2 className="text-sm font-medium text-foreground">Rapid-response protocol</h2>
        <p className="mt-1 text-sm text-muted">
          Not a live alert system. Follow this order when you need support:
        </p>
        <ol className="mt-3 flex flex-col gap-2">
          {steps.map((step, i) => (
            <Card key={step} className="flex gap-3 p-4">
              <span className="text-sm font-medium text-accent">{i + 1}</span>
              <span className="text-sm text-foreground">{step}</span>
            </Card>
          ))}
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-foreground">My buddy group</h2>
        <Card className="mt-2 p-4 text-sm text-muted">
          Buddy group rosters and emergency contact info live in an access-controlled area — coming
          soon.
        </Card>
      </section>
    </main>
  );
}
