"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { deleteUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Card } from "@/components/ui/Card";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { Select } from "@/components/ui/Select";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"sign-in" | "create-account">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pgyYear, setPgyYear] = useState<"1" | "2" | "3">("1");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch {
      setError("Could not sign in. Check your email and password.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateAccount(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const allowlistDoc = await getDoc(doc(db, "allowedEmails", email.toLowerCase()));
      if (!allowlistDoc.exists()) {
        setError("This email is not on the resident allowlist. Contact your program admin.");
        return;
      }
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      try {
        await setDoc(doc(db, "users", credential.user.uid), {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: credential.user.email?.split("@")[0] ?? "",
          pgyYear: Number(pgyYear),
          role: "resident",
        });
      } catch (profileError) {
        await deleteUser(credential.user);
        throw profileError;
      }
      router.push("/");
    } catch {
      setError("Could not create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <Card className="p-6">
        <EyebrowLabel>{mode === "sign-in" ? "Sign in" : "Create account"}</EyebrowLabel>
        <h1 className="mt-1 text-lg font-medium text-foreground">COMPASS resident hub</h1>

        <form
          onSubmit={mode === "sign-in" ? handleSignIn : handleCreateAccount}
          className="mt-5 flex flex-col gap-3"
        >
          <label className="text-sm text-muted">
            Email
            <input
              type="email"
              required
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </label>
          <label className="text-sm text-muted">
            Password
            <input
              type="password"
              required
              minLength={8}
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </label>

          {mode === "create-account" && (
            <label className="text-sm text-muted">
              PGY year
              <div className="mt-1">
                <Select
                  value={pgyYear}
                  onChange={(e) => setPgyYear(e.target.value as "1" | "2" | "3")}
                  className="w-full bg-background"
                >
                  <option value="1">PGY-1</option>
                  <option value="2">PGY-2</option>
                  <option value="3">PGY-3</option>
                </Select>
              </div>
            </label>
          )}

          {error && <p className="text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground disabled:opacity-60"
          >
            {mode === "sign-in" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setError(null);
            setMode(mode === "sign-in" ? "create-account" : "sign-in");
          }}
          className="mt-4 text-sm text-accent"
        >
          {mode === "sign-in" ? "New resident? Create an account" : "Already have an account? Sign in"}
        </button>
      </Card>
    </main>
  );
}
