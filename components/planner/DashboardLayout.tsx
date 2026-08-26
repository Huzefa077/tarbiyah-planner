"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

// Both signed-in users and guests use this same dashboard structure.
// They only provide different planner cards and, for guests, one extra notice.
type DashboardLayoutProps = {
  greeting: string;
  hasPlanners: boolean;
  children: ReactNode;
  notice?: ReactNode;
};

export function DashboardLayout({
  greeting,
  hasPlanners,
  children,
  notice,
}: DashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold sm:text-4xl">{greeting}</h1>

        <p className="mt-2 text-gray-600">
          Build consistent routines, track progress, and support positive habits one day at a time.
        </p>

        {notice}

        <section className={`${notice ? "mt-8" : "mt-12"} rounded-xl bg-white p-6 shadow`}>
          <h2 className="text-2xl font-semibold">Recent Planners</h2>

          {hasPlanners ? (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">{children}</ul>
          ) : (
            <p className="mt-3 text-gray-500">No planners created yet.</p>
          )}

          {/* Put the next action after the existing planner cards. */}
          <div className="mt-6 flex justify-center">
            <Button render={<Link href="/planner" />} nativeButton={false}>
              + Create Planner
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
