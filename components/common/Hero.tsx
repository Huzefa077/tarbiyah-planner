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
    <section className="mx-auto flex min-h-[calc(100svh-73px)] w-full max-w-6xl items-center justify-center px-5 py-8 sm:px-8 sm:py-16 lg:py-20">
      <div className="grid w-full items-center gap-7 sm:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="max-w-2xl text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary sm:text-sm sm:tracking-[0.2em]">
            Calm routines, one day at a time
          </p>
          <h1 className="mt-2 text-3xl leading-[1.15] font-bold tracking-tight sm:mt-4 sm:text-5xl sm:leading-tight lg:text-6xl">
            Make meaningful days easier to plan.
          </h1>
          <p className="mx-auto mt-4 max-w-lg px-1 text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:max-w-none sm:px-0 sm:text-lg sm:leading-7 lg:mx-0">
            Create a simple printable routine your child can follow with stars, stickers, ticks, and small rewards — making everyday habits more visible and enjoyable.
          </p>

          <div className="mt-6 flex flex-col items-stretch gap-3 sm:mt-8 sm:flex-row sm:justify-center lg:justify-start">
            <Button className="group" render={<Link href={user ? "/dashboard" : "/register"} />} nativeButton={false}>
              {user ? "Go to Dashboard" : "Create a Planner"}
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </Button>
            <Button render={<a href="#how-it-works" />} nativeButton={false} variant="outline">
              How it works
            </Button>
          </div>

          {user ? (
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:mt-4 sm:text-sm">
              {firstName ? `Welcome back, ${firstName}.` : "Welcome back."} Your saved planners are ready.
            </p>
          ) : (
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:mt-4 sm:text-sm">
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
