"use client";

import { FormEvent, useEffect, useState } from "react";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  createResource,
  deleteResource,
  subscribeToAllResources,
  updateResource,
} from "@/lib/firestore/resources";
import { computeNextReviewDue } from "@/lib/firestore/matrix";
import { useAuth } from "@/lib/auth-context";
import type { ContentStatus, ResourceCategory, ResourceEntry } from "@/types";

const categories: ResourceCategory[] = [
  "TPL / International Office",
  "GME resources",
  "J-1 / IMG institutional resources",
  "Mental health & EAP",
  "Legal aid / referral resources",
  "Emergency & after-hours contacts",
  "Financial & practical resources",
];

const emptyForm = {
  category: categories[0],
  name: "",
  roleOrOffice: "",
  contactMethods: "",
  whatTheyHelpWith: "",
  hours: "",
  lastReviewedDate: new Date().toISOString().slice(0, 10),
  reviewerName: "",
  status: "draft" as ContentStatus,
};

export default function AdminResourcesPage() {
  const { profile } = useAuth();
  const [items, setItems] = useState<ResourceEntry[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => subscribeToAllResources(setItems), []);

  const canEdit = profile?.role === "reviewer" || profile?.role === "admin";

  function startEdit(item: ResourceEntry) {
    setEditingId(item.id);
    setForm({
      category: item.category,
      name: item.name,
      roleOrOffice: item.roleOrOffice,
      contactMethods: item.contactMethods,
      whatTheyHelpWith: item.whatTheyHelpWith,
      hours: item.hours,
      lastReviewedDate: item.lastReviewedDate,
      reviewerName: item.reviewerName,
      status: item.status,
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
        nextReviewDue: computeNextReviewDue(form.lastReviewedDate),
        reviewerName: form.reviewerName || profile.displayName,
      };
      if (editingId) {
        await updateResource(editingId, payload);
      } else {
        await createResource(payload);
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
      <h1 className="mt-1 text-xl font-medium text-foreground">Resource directory content</h1>

      <Card className="mt-6 p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="text-sm text-muted">
            Category
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as ResourceCategory })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm text-muted">
              Name
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </label>
            <label className="text-sm text-muted">
              Role / office
              <input
                required
                value={form.roleOrOffice}
                onChange={(e) => setForm({ ...form, roleOrOffice: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </label>
          </div>

          <label className="text-sm text-muted">
            Contact methods
            <input
              required
              value={form.contactMethods}
              onChange={(e) => setForm({ ...form, contactMethods: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </label>

          <label className="text-sm text-muted">
            What they help with
            <textarea
              required
              rows={2}
              value={form.whatTheyHelpWith}
              onChange={(e) => setForm({ ...form, whatTheyHelpWith: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </label>

          <label className="text-sm text-muted">
            Hours (optional)
            <input
              value={form.hours}
              onChange={(e) => setForm({ ...form, hours: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </label>

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
              {editingId ? "Save changes" : "Add resource"}
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
                <span className="text-sm font-medium text-foreground">{item.name}</span>
                <Badge tone={item.status === "published" ? "accent" : "neutral"}>{item.status}</Badge>
              </div>
              <span className="text-xs text-muted">{item.category}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(item)} className="text-sm text-accent">
                Edit
              </button>
              <button onClick={() => deleteResource(item.id)} className="text-sm text-red-700">
                Delete
              </button>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
