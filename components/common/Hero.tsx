// Home hero: server-side account awareness plus a separate client-only planner demonstration.
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import PrintedPlannerPreview from "@/components/common/PrintedPlannerPreview";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";

export default async function Hero() {
  const user = await getCurrentUser();
  const firstName = user?.fullName.trim().split(/\s+/)[0];

  return (
    <section className="mx-auto flex min-h-[calc(100svh-73px)] w-full max-w-6xl items-center justify-center px-6 py-12 sm:px-8 sm:py-16 lg:py-20">
      <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="max-w-2xl text-center lg:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Calm routines, one day at a time
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Make meaningful days easier to plan.
          </h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
            Create a simple printable routine your child can follow with stars, stickers, ticks, and small rewards — making everyday habits more visible and enjoyable.
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button className="group" render={<Link href={user ? "/dashboard" : "/register"} />} nativeButton={false}>
              {user ? "Go to Dashboard" : "Create a Planner"}
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </Button>
            <Button render={<a href="#how-it-works" />} nativeButton={false} variant="outline">
              How it works
            </Button>
          </div>

          {user ? (
            <p className="mt-4 text-sm text-muted-foreground">
              {firstName ? `Welcome back, ${firstName}.` : "Welcome back."} Your saved planners are ready.
            </p>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Create it online, print it at home, then make progress visible together.
              <Link className="ml-1 font-medium text-primary hover:underline" href="/planner">
                Try as a guest
              </Link>
            </p>
          )}
        </div>

        <div className="flex justify-center lg:justify-end">
          <PrintedPlannerPreview />
        </div>
      </div>
    </section>
  );
}
