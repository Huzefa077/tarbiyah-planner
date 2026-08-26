// Home-page section that explains the real planner workflow and leads visitors into it.
import Link from "next/link";

import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "Step 1",
    title: "Start at the right level",
    description:
      "Choose an age group first, so the routine begins with an appropriate starting point.",
  },
  {
    number: "Step 2",
    title: "Build a balanced routine",
    description:
      "Pick up to four focus areas, then add the small daily activities your child can actually follow.",
  },
  {
    number: "Step 3",
    title: "Use it every day",
    description:
      "Preview the planner, print it in A4 or A3, and sign in whenever you want to save and edit it.",
  },
];

export default function Features() {
  return (
    <section className="mt-24 w-full max-w-5xl pb-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Simple by design
        </p>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
          Build a routine your child can follow
        </h2>
        <p className="mt-4 text-gray-600">
          Turn good intentions into a clear, printable daily plan in three small steps.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
              {step.number}
            </span>
            <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 text-center sm:flex-row sm:text-left">
        <p className="text-sm text-gray-600">
          Useful for school days, holidays, Ramadan, or a fresh start at home.
        </p>
        <Button render={<Link href="/planner" />} nativeButton={false}>
          Start a planner
        </Button>
      </div>
    </section>
  );
}
