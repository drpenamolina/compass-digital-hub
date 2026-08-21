"use client";

import { useState } from "react";
import { setSelfTrack } from "@/lib/firestore/matrix";

export function SelfTrackCheckbox({
  itemId,
  uid,
  initialDone,
}: {
  itemId: string;
  uid: string;
  initialDone: boolean;
}) {
  const [done, setDone] = useState(initialDone);
  const [saving, setSaving] = useState(false);

  async function toggle() {
    const next = !done;
    setDone(next);
    setSaving(true);
    try {
      await setSelfTrack(itemId, uid, next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <label className="flex items-center gap-2 text-sm text-foreground">
      <input
        type="checkbox"
        checked={done}
        disabled={saving}
        onChange={toggle}
        className="h-4 w-4 rounded border-border accent-[#123A5E]"
      />
      Action completed
    </label>
  );
}
