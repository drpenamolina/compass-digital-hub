"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import {
  computeNextReviewDue,
  createMatrixItem,
  deleteMatrixItem,
  subscribeToAllMatrixItems,
  updateMatrixItem,
} from "@/lib/firestore/matrix";
import { subscribeToAllResources } from "@/lib/firestore/resources";
import { useAuth } from "@/lib/auth-context";
import { useSubmitState } from "@/lib/use-submit-state";
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
  const { profile, loading } = useAuth();
  const [items, setItems] = useState<MatrixItem[]>([]);
  const [resources, setResources] = useState<ResourceEntry[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { submitting, error, success, run } = useSubmitState();
  const formRef = useRef<HTMLDivElement>(null);

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
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    await run(async () => {
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
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this matrix item? This cannot be undone.")) return;
    await deleteMatrixItem(id);
  }

  if (loading) {
    return null;
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

      <div ref={formRef}>
        <Card className="mt-6 p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-muted">
                Transition type
                <div className="mt-1">
                  <Select className="w-full bg-background"
                    value={form.transitionType}
                    onChange={(e) =>
                      setForm({ ...form, transitionType: e.target.value as TransitionType })
                    }
                  >
                    {transitionTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </div>
              </label>
              <label className="text-sm text-muted">
                Deadline type
                <div className="mt-1">
                  <Select className="w-full bg-background"
                    value={form.deadlineType}
                    onChange={(e) => setForm({ ...form, deadlineType: e.target.value as DeadlineType })}
                  >
                    {deadlineTypes.map((t) => (
                      <option key={t} value={t}>
                        {t.replaceAll("_", " ")}
                      </option>
                    ))}
                  </Select>
                </div>
              </label>
            </div>

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
              Trigger condition
              <input
                required
                value={form.triggerCondition}
                onChange={(e) => setForm({ ...form, triggerCondition: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
              />
            </label>

            <label className="text-sm text-muted">
              Action required
              <textarea
                required
                rows={2}
                value={form.actionRequired}
                onChange={(e) => setForm({ ...form, actionRequired: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
              />
            </label>

            <label className="text-sm text-muted">
              Authoritative source link
              <input
                required
                type="url"
                value={form.authoritativeSourceLink}
                onChange={(e) => setForm({ ...form, authoritativeSourceLink: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
              />
            </label>

            <label className="text-sm text-muted">
              Responsible contact
              <div className="mt-1">
                <Select className="w-full bg-background"
                  value={form.responsibleContactId}
                  onChange={(e) => setForm({ ...form, responsibleContactId: e.target.value })}
                >
                  <option value="">None</option>
                  {resources.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </Select>
              </div>
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
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
                />
              </label>
              <label className="text-sm text-muted">
                Last reviewed date
                <input
                  required
                  type="date"
                  value={form.lastReviewedDate}
                  onChange={(e) => setForm({ ...form, lastReviewedDate: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
                />
              </label>
              <label className="text-sm text-muted">
                Status
                <div className="mt-1">
                  <Select className="w-full bg-background"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as ContentStatus })}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </Select>
                </div>
              </label>
            </div>

            {error && <p className="text-sm text-red-700">{error}</p>}

            <div className="mt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground disabled:opacity-60"
              >
                {submitting ? "Saving…" : editingId ? "Save changes" : "Add matrix item"}
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
              <button onClick={() => startEdit(item)} className="text-sm text-accent">
                Edit
              </button>
              <button onClick={() => handleDelete(item.id)} className="text-sm text-red-700">
                Delete
              </button>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
