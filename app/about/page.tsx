// ROUTE: /about — public explanation of what Tarbiyah Planner does and its current scope.
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <article className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow sm:p-10">
        <p className="text-sm font-medium text-primary">About the project</p>
        <h1 className="mt-2 text-4xl font-bold">Tarbiyah Planner</h1>

        <p className="mt-5 text-gray-600">
          Tarbiyah Planner helps parents create simple, age-appropriate daily
          routines for children. A planner can include learning, good deeds,
          movement, prayer, family time, and custom activities.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">How to use it</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-gray-600">
            <li>Start a new planner and choose the child&apos;s age group.</li>
            <li>Choose up to four sections for the routine.</li>
            <li>Add activities, then preview and print the finished planner.</li>
            <li>Sign in to save, edit, and revisit planners from the dashboard.</li>
          </ol>
        </section>

        <section className="mt-10 rounded-lg border border-dashed p-5">
          <h2 className="text-xl font-semibold">Under development</h2>
          <p className="mt-2 text-gray-600">
            This space is reserved for future guidance, examples, and new
            planning tools. The project is actively being improved.
          </p>
        </section>

        <Button
          className="mt-10"
          render={<Link href="/planner" />}
          nativeButton={false}
        >
          Create a planner
        </Button>
      </article>
    </main>
  );
}
