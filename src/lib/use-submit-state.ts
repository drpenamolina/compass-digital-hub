import { useState } from "react";

export function useSubmitState() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function run(fn: () => Promise<void>) {
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      await fn();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return { submitting, error, success, run };
}
