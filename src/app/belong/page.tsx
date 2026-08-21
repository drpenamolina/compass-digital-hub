"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { subscribeToPublishedBelongEvents } from "@/lib/firestore/belong";
import { formatDate } from "@/lib/date";
import type { BelongEvent } from "@/types";

function EventCard({ event }: { event: BelongEvent }) {
  return (
    <Card className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:gap-4">
      {event.photoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.photoUrl}
          alt=""
          className="h-32 w-full rounded-lg object-cover sm:h-20 sm:w-28"
        />
      )}
      <div>
        <p className="text-xs text-muted">
          {event.country} · {formatDate(event.eventDate)}
        </p>
        <h3 className="mt-0.5 text-sm font-medium text-foreground">{event.title}</h3>
        <p className="mt-1 text-sm text-muted">{event.description}</p>
      </div>
    </Card>
  );
}

export default function BelongPage() {
  const [events, setEvents] = useState<BelongEvent[]>([]);

  useEffect(() => subscribeToPublishedBelongEvents(setEvents), []);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events
    .filter((e) => e.eventDate >= today)
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate));
  const past = events
    .filter((e) => e.eventDate < today)
    .sort((a, b) => b.eventDate.localeCompare(a.eventDate));

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <EyebrowLabel>Program pillar</EyebrowLabel>
      <h1 className="mt-1 text-xl font-medium text-foreground">Belong — Travel From Home</h1>
      <p className="mt-2 text-sm text-muted">
        Upcoming and past cultural events shared by residents and the program.
      </p>

      <section className="mt-6">
        <EyebrowLabel>Upcoming</EyebrowLabel>
        <div className="mt-2 flex flex-col gap-3">
          {upcoming.length === 0 ? (
            <Card className="p-4 text-sm text-muted">No upcoming events yet.</Card>
          ) : (
            upcoming.map((event) => <EventCard key={event.id} event={event} />)
          )}
        </div>
      </section>

      <section className="mt-8">
        <EyebrowLabel>Past events</EyebrowLabel>
        <div className="mt-2 flex flex-col gap-3">
          {past.length === 0 ? (
            <Card className="p-4 text-sm text-muted">No past events archived yet.</Card>
          ) : (
            past.map((event) => <EventCard key={event.id} event={event} />)
          )}
        </div>
      </section>
    </main>
  );
}
