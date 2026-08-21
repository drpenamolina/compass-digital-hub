"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import {
  createNavigateItem,
  deleteNavigateItem,
  subscribeToAllNavigateItems,
  updateNavigateItem,
} from "@/lib/firestore/navigate";
import { computeNextReviewDue } from "@/lib/firestore/matrix";
import { useAuth } from "@/lib/auth-context";
import { useSubmitState } from "@/lib/use-submit-state";
import type { ContentStatus, NavigateCategory, NavigateItem } from "@/types";

const categories: NavigateCategory[] = ["Monthly resource", "Session material", "Bridge to Intake"];

const emptyForm = {
  category: categories[0],
  title: "",
  description: "",
  linkUrl: "",
  lastReviewedDate: new Date().toISOString().slice(0, 10),
  reviewerName: "",
  status: "draft" as ContentStatus,
};

export default function AdminNavigatePage() {
  const { profile, loading } = useAuth();
  const [items, setItems] = useState<NavigateItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { submitting, error, success, run } = useSubmitState();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => subscribeToAllNavigateItems(setItems), []);

  const canEdit = profile?.role === "reviewer" || profile?.role === "admin";

  function startEdit(item: NavigateItem) {
    setEditingId(item.id);
    setForm({
      category: item.category,
      title: item.title,
      description: item.description,
      linkUrl: item.linkUrl,
      lastReviewedDate: item.lastReviewedDate,
      reviewerName: item.reviewerName,
      status: item.status,
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
        nextReviewDue: computeNextReviewDue(form.lastReviewedDate),
        reviewerName: form.reviewerName || profile.displayName,
      };
      if (editingId) {
        await updateNavigateItem(editingId, payload);
      } else {
        await createNavigateItem(payload);
      }
      resetForm();
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this Navigate item? This cannot be undone.")) return;
    await deleteNavigateItem(id);
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
      <h1 className="mt-1 text-xl font-medium text-foreground">Navigate content</h1>

      <div ref={formRef}>
        <Card className="mt-6 p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="text-sm text-muted">
              Category
              <div className="mt-1">
                <Select className="w-full bg-background"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as NavigateCategory })}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
            </label>

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
              Link (optional)
              <input
                type="url"
                value={form.linkUrl}
                onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
              />
            </label>

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
                {submitting ? "Saving…" : editingId ? "Save changes" : "Add Navigate item"}
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
              <span className="text-xs text-muted">{item.category}</span>
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
