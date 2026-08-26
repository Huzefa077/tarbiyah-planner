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
            Build good habits with simple daily routines.
          </h1>
          <p className="mx-auto mt-4 max-w-lg px-1 text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:max-w-none sm:px-0 sm:text-lg sm:leading-7 lg:mx-0">
            Create a printable routine with simple daily activities, stars, and weekly rewards your child will look forward to.
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
              Not ready to sign up?
              <Link
                className="ml-2 inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-semibold text-primary shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-md hover:shadow-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transform-none"
                href="/planner"
              >
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
