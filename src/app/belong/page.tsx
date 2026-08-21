import { Card } from "@/components/ui/Card";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";

export default function BelongPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <EyebrowLabel>Program pillar</EyebrowLabel>
      <h1 className="mt-1 text-xl font-medium text-foreground">Belong — Travel From Home</h1>
      <p className="mt-2 text-sm text-muted">
        Upcoming and past cultural events shared by residents and the program.
      </p>
      <div className="mt-6">
        <Card className="p-4 text-sm text-muted">No events listed yet.</Card>
      </div>
    </main>
  );
}
