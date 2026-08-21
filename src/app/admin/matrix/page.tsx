"use client";

import { FormEvent, useEffect, useState } from "react";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  computeNextReviewDue,
  createMatrixItem,
  deleteMatrixItem,
  subscribeToAllMatrixItems,
  updateMatrixItem,
} from "@/lib/firestore/matrix";
import { subscribeToAllResources } from "@/lib/firestore/resources";
import { useAuth } from "@/lib/auth-context";
import type { ContentStatus, DeadlineType, MatrixItem, ResourceEntry, TransitionType } from "@/types";

const transitionTypes: TransitionType[] = [
  "Travel Documentation",
  "Visa/J-1 Renewal",
  "Licensure Step",
  "Fellowship Eligibility",
  "Waiver Planning",
  "Post-Residency Employment",
];

const deadlineTypes: DeadlineType[] = [
  "fixed_date",
  "relative_to_pgy_milestone",
  "relative_to_program_end",
];

const emptyForm = {
  transitionType: transitionTypes[0],
  title: "",
  description: "",
  triggerCondition: "",
  deadlineType: deadlineTypes[0],
  actionRequired: "",
  responsibleContactId: "",
  authoritativeSourceLink: "",
  lastReviewedDate: new Date().toISOString().slice(0, 10),
  reviewerName: "",
  status: "draft" as ContentStatus,
  pgyYears: [] as Array<1 | 2 | 3>,
};

export default function AdminMatrixPage() {
  const { profile } = useAuth();
  const [items, setItems] = useState<MatrixItem[]>([]);
  const [resources, setResources] = useState<ResourceEntry[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => subscribeToAllMatrixItems(setItems), []);
  useEffect(() => subscribeToAllResources(setResources), []);

  const canEdit = profile?.role === "reviewer" || profile?.role === "admin";

  function togglePgyYear(year: 1 | 2 | 3) {
    setForm((prev) => ({
      ...prev,
      pgyYears: prev.pgyYears.includes(year)
        ? prev.pgyYears.filter((y) => y !== year)
        : [...prev.pgyYears, year],
    }));
  }

  function startEdit(item: MatrixItem) {
    setEditingId(item.id);
    setForm({
      transitionType: item.transitionType,
      title: item.title,
      description: item.description,
      triggerCondition: item.triggerCondition,
      deadlineType: item.deadlineType,
      actionRequired: item.actionRequired,
      responsibleContactId: item.responsibleContactId ?? "",
      authoritativeSourceLink: item.authoritativeSourceLink,
      lastReviewedDate: item.lastReviewedDate,
      reviewerName: item.reviewerName,
      status: item.status,
      pgyYears: item.pgyYears,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        responsibleContactId: form.responsibleContactId || null,
        nextReviewDue: computeNextReviewDue(form.lastReviewedDate),
        reviewerName: form.reviewerName || profile.displayName,
        residentSelfTrack: editingId
          ? items.find((i) => i.id === editingId)?.residentSelfTrack ?? {}
          : {},
      };
      if (editingId) {
        await updateMatrixItem(editingId, payload);
      } else {
        await createMatrixItem(payload);
      }
      resetForm();
    } finally {
      setSubmitting(false);
    }
  }

  if (!canEdit) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="text-sm text-muted">
          This area is restricted to reviewers and admins.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <EyebrowLabel>Admin</EyebrowLabel>
      <h1 className="mt-1 text-xl font-medium text-foreground">Matrix content</h1>

      <Card className="mt-6 p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm text-muted">
              Transition type
              <select
                value={form.transitionType}
                onChange={(e) =>
                  setForm({ ...form, transitionType: e.target.value as TransitionType })
                }
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                {transitionTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-muted">
              Deadline type
              <select
                value={form.deadlineType}
                onChange={(e) => setForm({ ...form, deadlineType: e.target.value as DeadlineType })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                {deadlineTypes.map((t) => (
                  <option key={t} value={t}>
                    {t.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
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
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </label>

          <label className="text-sm text-muted">
            Trigger condition
            <input
              required
              value={form.triggerCondition}
              onChange={(e) => setForm({ ...form, triggerCondition: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </label>

          <label className="text-sm text-muted">
            Action required
            <textarea
              required
              rows={2}
              value={form.actionRequired}
              onChange={(e) => setForm({ ...form, actionRequired: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </label>

          <label className="text-sm text-muted">
            Authoritative source link
            <input
              required
              type="url"
              value={form.authoritativeSourceLink}
              onChange={(e) => setForm({ ...form, authoritativeSourceLink: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </label>

          <label className="text-sm text-muted">
            Responsible contact
            <select
              value={form.responsibleContactId}
              onChange={(e) => setForm({ ...form, responsibleContactId: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">None</option>
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="text-sm text-muted">Applies to PGY years</span>
            <div className="mt-1 flex gap-4">
              {[1, 2, 3].map((year) => (
                <label key={year} className="flex items-center gap-1.5 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={form.pgyYears.includes(year as 1 | 2 | 3)}
                    onChange={() => togglePgyYear(year as 1 | 2 | 3)}
                    className="h-4 w-4 rounded border-border accent-[#123A5E]"
                  />
                  PGY-{year}
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="text-sm text-muted">
              Reviewer name
              <input
                required
                value={form.reviewerName}
                onChange={(e) => setForm({ ...form, reviewerName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </label>
            <label className="text-sm text-muted">
              Last reviewed date
              <input
                required
                type="date"
                value={form.lastReviewedDate}
                onChange={(e) => setForm({ ...form, lastReviewedDate: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </label>
            <label className="text-sm text-muted">
              Status
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as ContentStatus })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
          </div>

          <div className="mt-2 flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground disabled:opacity-60"
            >
              {editingId ? "Save changes" : "Add matrix item"}
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
        {items.map((item) => (
          <Card key={item.id} className="flex items-center justify-between gap-3 p-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{item.title}</span>
                <Badge tone={item.status === "published" ? "accent" : "neutral"}>{item.status}</Badge>
              </div>
              <span className="text-xs text-muted">{item.transitionType}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(item)}
                className="text-sm text-accent"
              >
                Edit
              </button>
              <button
                onClick={() => deleteMatrixItem(item.id)}
                className="text-sm text-red-700"
              >
                Delete
              </button>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
