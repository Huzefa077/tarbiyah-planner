"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/common/ThemeToggle";

// This compact navigation replaces the desktop row on small screens.
export default function MobileNavbarMenu({
  isSignedIn,
}: {
  isSignedIn: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <nav className="relative flex items-center justify-between px-4 py-3 sm:hidden">
      <Link
        className="font-fredoka text-xl font-semibold text-primary"
        href="/"
        onClick={closeMenu}
      >
        Tarbiyah Planner
      </Link>

      <button
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        className="flex size-10 items-center justify-center rounded-lg border border-border bg-background text-foreground"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {isOpen ? (
          <span aria-hidden="true" className="text-2xl leading-none">×</span>
        ) : (
          <span aria-hidden="true" className="text-2xl leading-none">☰</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 w-full border-b border-border bg-card px-4 py-4 shadow-lg">
          <div className="flex flex-col gap-1">
            <Link className="rounded-md px-3 py-2 text-base font-medium hover:bg-muted" href="/dashboard" onClick={closeMenu}>
              Dashboard
            </Link>
            <Link className="rounded-md px-3 py-2 text-base font-medium hover:bg-muted" href="/about" onClick={closeMenu}>
              About
            </Link>
            <Link className="rounded-md px-3 py-2 text-base font-medium hover:bg-muted" href="/feedback" onClick={closeMenu}>
              Feedback
            </Link>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <ThemeToggle />

            {isSignedIn ? (
              <form action="/api/auth/logout" method="POST">
                <Button type="submit" variant="outline">Log out</Button>
              </form>
            ) : (
              <div className="flex items-center gap-3">
                <Link className="text-base font-medium text-gray-600 hover:text-foreground" href="/login" onClick={closeMenu}>
                  Sign in
                </Link>
                <Button render={<Link href="/register" onClick={closeMenu} />} nativeButton={false}>
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
