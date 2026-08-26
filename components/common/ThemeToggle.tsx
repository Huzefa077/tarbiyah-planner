"use client";

// This needs the browser because it changes <html> when the visitor clicks it.
import { useState } from "react";

import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  // Dark matches the root layout's initial class.
  const [isDark, setIsDark] = useState(true);

  function toggleTheme() {
    const nextIsDark = !isDark;

    setIsDark(nextIsDark);
    document.documentElement.classList.toggle("dark", nextIsDark);
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative h-8 w-18 rounded-full p-1"
    >
      {/* The circle moves under the active icon; both choices stay visible. */}
      <span
        aria-hidden="true"
        className={`absolute left-1 top-1 size-6 rounded-full bg-foreground/15 transition-transform duration-200 ${
          isDark ? "translate-x-10" : "translate-x-0"
        }`}
      />

      <span aria-hidden="true" className="sr-only">
        <span>☀</span>
        <span>☾</span>
      </span>

      {/* Each icon has the same 24px square as the moving circle. */}
      <span aria-hidden="true" className="absolute inset-0 z-10">
        <span className="absolute left-1 top-1 flex size-6 items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        </span>

        <span className="absolute right-1 top-1 flex size-6 items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8Z" />
          </svg>
        </span>
      </span>
    </Button>
  );
}
