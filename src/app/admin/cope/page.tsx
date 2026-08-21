"use client";

import { FormEvent, useEffect, useState } from "react";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  createCopeSession,
  deleteCopeSession,
  subscribeToAllCopeSessions,
  updateCopeSession,
} from "@/lib/firestore/cope";
import { useAuth } from "@/lib/auth-context";
import type { CopeSession } from "@/types";

const emptyForm = {
  sessionNumber: 1,
  sessionDate: new Date().toISOString().slice(0, 10),
  title: "",
  description: "",
  status: "draft" as "draft" | "published",
};

export default function AdminCopePage() {
  const { profile } = useAuth();
  const [sessions, setSessions] = useState<CopeSession[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => subscribeToAllCopeSessions(setSessions), []);

  const canEdit = profile?.role === "reviewer" || profile?.role === "admin";

  function startEdit(session: CopeSession) {
    setEditingId(session.id);
    setForm({
      sessionNumber: session.sessionNumber,
      sessionDate: session.sessionDate,
      title: session.title,
      description: session.description,
      status: session.status,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateCopeSession(editingId, form);
      } else {
        await createCopeSession(form);
      }
      resetForm();
    } finally {
      setSubmitting(false);
    }
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
      <h1 className="mt-1 text-xl font-medium text-foreground">Cope content</h1>

      <Card className="mt-6 p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm text-muted">
              Session number
              <input
                required
                type="number"
                min={1}
                max={6}
                value={form.sessionNumber}
                onChange={(e) => setForm({ ...form, sessionNumber: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </label>
            <label className="text-sm text-muted">
              Session date
              <input
                required
                type="date"
                value={form.sessionDate}
                onChange={(e) => setForm({ ...form, sessionDate: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </label>
          </div>

          <label className="text-sm text-muted">
            Title
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </label>

          <label className="text-sm text-muted">
            Description
            <textarea
              required
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </label>

          <label className="text-sm text-muted">
            Status
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>

          <div className="mt-2 flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground disabled:opacity-60"
            >
              {editingId ? "Save changes" : "Add session"}
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
          </div>
        </form>
      </Card>

      <div className="mt-8 flex flex-col gap-3">
        {[...sessions]
          .sort((a, b) => a.sessionNumber - b.sessionNumber)
          .map((session) => (
            <Card key={session.id} className="flex items-center justify-between gap-3 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    Session {session.sessionNumber}: {session.title}
                  </span>
                  <Badge tone={session.status === "published" ? "accent" : "neutral"}>
                    {session.status}
                  </Badge>
                </div>
                <span className="text-xs text-muted">{session.sessionDate}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(session)} className="text-sm text-accent">
                  Edit
                </button>
                <button onClick={() => deleteCopeSession(session.id)} className="text-sm text-red-700">
                  Delete
                </button>
              </div>
            </Card>
          ))}
      </div>
    </main>
  );
}
