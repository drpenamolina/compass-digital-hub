"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import {
  createBelongEvent,
  deleteBelongEvent,
  subscribeToAllBelongEvents,
  updateBelongEvent,
} from "@/lib/firestore/belong";
import { useAuth } from "@/lib/auth-context";
import { useSubmitState } from "@/lib/use-submit-state";
import type { BelongEvent } from "@/types";

const emptyForm = {
  title: "",
  country: "",
  eventDate: new Date().toISOString().slice(0, 10),
  description: "",
  photoUrl: "",
  status: "draft" as "draft" | "published",
};

export default function AdminBelongPage() {
  const { profile, loading } = useAuth();
  const [events, setEvents] = useState<BelongEvent[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { submitting, error, success, run } = useSubmitState();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => subscribeToAllBelongEvents(setEvents), []);

  const canEdit = profile?.role === "reviewer" || profile?.role === "admin";

  function startEdit(event: BelongEvent) {
    setEditingId(event.id);
    setForm({
      title: event.title,
      country: event.country,
      eventDate: event.eventDate,
      description: event.description,
      photoUrl: event.photoUrl,
      status: event.status,
    });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await run(async () => {
      if (editingId) {
        await updateBelongEvent(editingId, form);
      } else {
        await createBelongEvent(form);
      }
      resetForm();
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    await deleteBelongEvent(id);
  }

  if (loading) {
    return null;
  }

  if (!canEdit) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="text-sm text-muted">This area is restricted to reviewers and admins.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <EyebrowLabel>Admin</EyebrowLabel>
      <h1 className="mt-1 text-xl font-medium text-foreground">Belong content</h1>

      <div ref={formRef}>
        <Card className="mt-6 p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-muted">
                Title
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
                />
              </label>
              <label className="text-sm text-muted">
                Country / culture
                <input
                  required
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
                />
              </label>
            </div>

            <label className="text-sm text-muted">
              Event date
              <input
                required
                type="date"
                value={form.eventDate}
                onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
              />
            </label>

            <label className="text-sm text-muted">
              Description
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
              />
            </label>

            <label className="text-sm text-muted">
              Photo URL (optional)
              <input
                type="url"
                value={form.photoUrl}
                onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
              />
            </label>

            <label className="text-sm text-muted">
              Status
              <div className="mt-1">
                <Select className="w-full bg-background"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </Select>
              </div>
            </label>

            {error && <p className="text-sm text-red-700">{error}</p>}

            <div className="mt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground disabled:opacity-60"
              >
                {submitting ? "Saving…" : editingId ? "Save changes" : "Add event"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-border px-3 py-2 text-sm text-muted"
                >
                  Cancel
                </button>
              )}
              {success && <span className="text-sm text-accent">Saved</span>}
            </div>
          </form>
        </Card>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {[...events]
          .sort((a, b) => b.eventDate.localeCompare(a.eventDate))
          .map((event) => (
            <Card key={event.id} className="flex items-center justify-between gap-3 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{event.title}</span>
                  <Badge tone={event.status === "published" ? "accent" : "neutral"}>
                    {event.status}
                  </Badge>
                </div>
                <span className="text-xs text-muted">
                  {event.country} · {event.eventDate}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(event)} className="text-sm text-accent">
                  Edit
                </button>
                <button onClick={() => handleDelete(event.id)} className="text-sm text-red-700">
                  Delete
                </button>
              </div>
            </Card>
          ))}
      </div>
    </main>
  );
}
