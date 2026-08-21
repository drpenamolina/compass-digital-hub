"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { IconMenu2, IconX } from "@tabler/icons-react";
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
  const { user, profile, loading } = useAuth();
  const canAdmin = !loading && (profile?.role === "reviewer" || profile?.role === "admin");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" aria-label="COMPASS home" onClick={() => setMenuOpen(false)}>
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
          {canAdmin && (
            <Link href="/admin" className="text-sm text-muted transition-colors hover:text-accent">
              Admin
            </Link>
          )}
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

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="text-muted md:hidden"
        >
          {menuOpen ? <IconX size={22} stroke={1.5} /> : <IconMenu2 size={22} stroke={1.5} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="flex flex-col border-t border-border px-4 py-2 md:hidden">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-border py-3 text-sm text-foreground last:border-b-0"
            >
              {item.label}
            </Link>
          ))}
          {canAdmin && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="border-b border-border py-3 text-sm text-foreground"
            >
              Admin
            </Link>
          )}
          {user ? (
            <button
              onClick={() => {
                setMenuOpen(false);
                signOut(auth);
              }}
              className="py-3 text-left text-sm text-muted"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="py-3 text-sm text-accent"
            >
              Sign in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
