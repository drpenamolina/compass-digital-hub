"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { LogoLockup } from "@/components/ui/Logo";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

const primaryNav = [
  { href: "/matrix", label: "Matrix" },
  { href: "/resources", label: "Resources" },
  { href: "/navigate", label: "Navigate" },
  { href: "/cope", label: "Cope" },
  { href: "/belong", label: "Belong" },
  { href: "/restore", label: "Restore" },
];

export function Header() {
  const { user } = useAuth();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" aria-label="COMPASS home">
          <LogoLockup className="h-7 sm:h-8" />
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <button onClick={() => signOut(auth)} className="text-sm text-muted hover:text-accent">
              Sign out
            </button>
          ) : (
            <Link href="/login" className="text-sm text-accent">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
