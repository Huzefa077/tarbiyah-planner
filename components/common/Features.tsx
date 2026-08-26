// Home-page content after the hero: value, benefits, workflow, use cases, and final action.
import Link from "next/link";
import { BookOpen, CalendarDays, Heart, Sparkles, Star } from "lucide-react";

import Reveal from "@/components/common/Reveal";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: BookOpen,
    title: "A plan children can see",
    description: "Give everyday goals a clear place instead of relying on reminders all day.",
  },
  {
    icon: Heart,
    title: "Balanced, meaningful activities",
    description: "Make room for learning, movement, helpfulness, creativity, and family time.",
  },
  {
    icon: CalendarDays,
    title: "Easy to use together",
    description: "Preview it, print it, and turn small daily actions into a shared routine.",
  },
];

const steps = [
  ["01", "Build the routine", "Choose the focus areas and activities that matter for your child."],
  ["02", "Print the planner", "Generate the monthly planner and print it in the available paper size."],
  ["03", "Make progress visible", "Let your child use stars, stickers, ticks, or stamps and celebrate simple rewards."],
];

const useCases = ["School days", "Weekends", "School holidays", "Ramadan", "New routines", "Screen-heavy days"];
const rewardExamples = ["Choose a family activity", "Pick a favourite meal", "Extra outdoor play", "Visit the park", "Bake together", "Choose the weekend activity", "A small book or craft item"];

export default function Features() {
  return (
    <div className="w-full">
      <Reveal className="border-y border-border bg-secondary/35">
        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Less deciding, more doing</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">A little structure can make the day feel lighter.</h2>
            <p className="mt-4 leading-7 text-muted-foreground">Instead of deciding what to do again every morning, prepare a simple plan that makes good choices visible.</p>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Why it helps</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Built for real family days.</h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }) => (
              <article className="rounded-2xl border border-border bg-card p-6 transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:bg-secondary/40 motion-reduce:transform-none motion-reduce:transition-none" key={title}>
                <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><Icon aria-hidden="true" className="size-5" /></span>
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-2 leading-6 text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal className="border-y border-border bg-secondary/35">
        <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Celebrate effort</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Make progress feel rewarding.</h2>
            <p className="mt-4 leading-7 text-muted-foreground">Children can mark completed activities with star stickers, ticks, or stamps and work toward simple weekly and monthly rewards chosen by the parent.</p>
            <p className="mt-3 leading-7 text-muted-foreground">The goal is not expensive rewards. Small experiences and privileges can make progress visible and give children something positive to work toward.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {rewardExamples.map((reward) => <span className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground" key={reward}>{reward}</span>)}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-semibold">This week</p>
            <div className="mt-4 flex gap-1 text-amber-500">
              {[1, 2, 3, 4].map((star) => <Star aria-hidden="true" className="size-7 fill-amber-400" key={star} />)}
              <Star aria-hidden="true" className="size-7 text-amber-500" />
            </div>
            <p className="mt-3 text-sm font-medium">4 of 5 goals completed</p>
            <div className="mt-5 border-t border-border pt-4 text-sm text-muted-foreground">
              <p><span className="font-semibold text-foreground">Weekly reward:</span> Choose a family activity</p>
              <p className="mt-2"><span className="font-semibold text-foreground">Monthly goal:</span> 20 stars</p>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-24" id="how-it-works">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">How it works</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Three calm steps to a clearer month.</h2>
          </div>

          <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
            {steps.map(([number, title, description], index) => (
              <li className="relative" key={number}>
                {index < steps.length - 1 && <span aria-hidden="true" className="absolute left-11 top-5 hidden h-px w-[calc(100%-1.5rem)] bg-border md:block" />}
                <span className="relative grid size-10 place-items-center rounded-full border border-primary/30 bg-background text-sm font-bold text-primary">{number}</span>
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-2 max-w-sm leading-6 text-muted-foreground">{description}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-col items-start gap-3 text-sm font-medium text-muted-foreground sm:flex-row sm:items-center sm:gap-2">
            {["Plan", "Print", "Complete", "Stick a star", "Celebrate"].map((label, index) => (
              <span className="flex items-center gap-2" key={label}>
                {index > 0 && <span aria-hidden="true" className="hidden text-primary sm:inline">→</span>}
                <span className="rounded-full border border-border bg-card px-3 py-1.5">{label}</span>
              </span>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal className="border-y border-border bg-secondary/35">
        <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Made for everyday life</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Useful whenever your family needs more structure.</h2>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {useCases.map((useCase) => <span className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground" key={useCase}>{useCase}</span>)}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mx-auto max-w-4xl px-6 py-20 text-center sm:px-8 sm:py-28">
          <Sparkles aria-hidden="true" className="mx-auto size-6 text-primary" />
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Start with one meaningful routine.</h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-muted-foreground">Create a planner in a few minutes, make it yours, and give your child a clear way to take part every day.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button render={<Link href="/planner" />} nativeButton={false}>Create a planner</Button>
            <Button render={<Link href="/about" />} nativeButton={false} variant="outline">Learn about the project</Button>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
