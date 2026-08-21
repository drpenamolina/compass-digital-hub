"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { IconChecklist, IconAddressBook, IconShieldCheck } from "@tabler/icons-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { ReviewedStamp } from "@/components/ui/ReviewedStamp";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { PillarTiles } from "@/components/layout/PillarTiles";
import { useAuth } from "@/lib/auth-context";
import { isExpired, subscribeToPublishedMatrixItems } from "@/lib/firestore/matrix";
import type { MatrixItem } from "@/types";

export default function Home() {
  const { user, profile, loading } = useAuth();
  const [items, setItems] = useState<MatrixItem[]>([]);

  useEffect(() => subscribeToPublishedMatrixItems(setItems), []);

  const upcoming = useMemo(() => {
    return items
      .filter((item) => !isExpired(item.nextReviewDue))
      .filter((item) => !profile || item.pgyYears.includes(profile.pgyYear))
      .sort((a, b) => a.nextReviewDue.localeCompare(b.nextReviewDue))
      .slice(0, 2);
  }, [items, profile]);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="animate-pulse">
          <div className="h-3 w-16 rounded bg-border" />
          <div className="mt-2 h-6 w-48 rounded bg-border" />
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="h-24 rounded-xl border border-border bg-surface" />
            <div className="h-24 rounded-xl border border-border bg-surface" />
            <div className="h-24 rounded-xl border border-border bg-surface" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <EyebrowLabel>{profile ? `PGY-${profile.pgyYear}` : "Welcome"}</EyebrowLabel>
      <h1 className="mt-1 text-xl font-medium text-foreground">
        {profile ? `Hi, ${profile.displayName}` : "COMPASS resident hub"}
      </h1>

      {!user && (
        <p className="mt-2 text-sm text-muted">
          <Link href="/login" className="text-accent underline underline-offset-2">
            Sign in
          </Link>{" "}
          to see your timeline and track your progress.
        </p>
      )}

      <div className="mt-4">
        <DisclaimerBanner>
          This hub provides general awareness, not individualized legal or immigration advice.
          Confirm specific questions with the responsible office listed on each item.
        </DisclaimerBanner>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link href="/matrix">
          <Card className="flex h-full flex-col gap-2 p-4 transition-colors hover:border-accent/40">
            <IconChecklist size={20} className="text-muted" stroke={1.5} />
            <span className="text-sm font-medium text-foreground">Action Matrix</span>
            <span className="text-xs text-muted">Deadlines and required actions</span>
          </Card>
        </Link>
        <Link href="/resources">
          <Card className="flex h-full flex-col gap-2 p-4 transition-colors hover:border-accent/40">
            <IconAddressBook size={20} className="text-muted" stroke={1.5} />
            <span className="text-sm font-medium text-foreground">Resource directory</span>
            <span className="text-xs text-muted">Offices and contacts by category</span>
          </Card>
        </Link>
        {profile?.role === "reviewer" || profile?.role === "admin" ? (
          <Link href="/admin">
            <Card className="flex h-full flex-col gap-2 p-4 transition-colors hover:border-accent/40">
              <IconShieldCheck size={20} className="text-muted" stroke={1.5} />
              <span className="text-sm font-medium text-foreground">Admin</span>
              <span className="text-xs text-muted">Review queue and content</span>
            </Card>
          </Link>
        ) : (
          <Link href="/restore">
            <Card className="flex h-full flex-col gap-2 p-4 transition-colors hover:border-accent/40">
              <IconShieldCheck size={20} className="text-muted" stroke={1.5} />
              <span className="text-sm font-medium text-foreground">Rapid response</span>
              <span className="text-xs text-muted">Who to contact, in what order</span>
            </Card>
          </Link>
        )}
      </div>

      <section className="mt-8">
        <EyebrowLabel>Your timeline</EyebrowLabel>
        <div className="mt-2 flex flex-col gap-3">
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted">No upcoming matrix items yet.</p>
          ) : (
            upcoming.map((item) => (
              <Card key={item.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <Badge tone="neutral">{item.transitionType}</Badge>
                  <p className="mt-1.5 text-sm font-medium text-foreground">{item.title}</p>
                </div>
                <ReviewedStamp date={item.lastReviewedDate} />
              </Card>
            ))
          )}
        </div>
      </section>

      <section className="mt-8">
        <EyebrowLabel>Program pillars</EyebrowLabel>
        <div className="mt-2">
          <PillarTiles />
        </div>
      </section>
    </main>
  );
}
