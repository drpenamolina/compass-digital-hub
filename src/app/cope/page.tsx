"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { subscribeToPublishedCopeSessions } from "@/lib/firestore/cope";
import { formatDate } from "@/lib/date";
import type { CopeSession } from "@/types";

const instruments = [
  "AAQ (Acceptance and Action Questionnaire)",
  "Brief Resilience Scale",
  "Self-Compassion Scale",
  "Perceived Stress Scale",
];

export default function CopePage() {
  const [sessions, setSessions] = useState<CopeSession[]>([]);

  useEffect(() => subscribeToPublishedCopeSessions(setSessions), []);

  const sorted = [...sessions].sort((a, b) => a.sessionNumber - b.sessionNumber);

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
        <div className="mt-2 flex flex-col gap-3">
          {sorted.length === 0 ? (
            <Card className="p-4 text-sm text-muted">Schedule coming soon.</Card>
          ) : (
            sorted.map((session) => (
              <Card key={session.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <Badge tone="neutral">Session {session.sessionNumber}</Badge>
                  <p className="mt-1.5 text-sm font-medium text-foreground">{session.title}</p>
                  <p className="text-sm text-muted">{session.description}</p>
                </div>
                <span className="whitespace-nowrap text-xs text-muted">
                  {formatDate(session.sessionDate)}
                </span>
              </Card>
            ))
          )}
        </div>
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
