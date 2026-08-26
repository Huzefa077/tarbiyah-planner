"use client";

import { projectUpdates } from "@/config/projectUpdates";

function LocalUpdateTime({ publishedAt }: { publishedAt: string }) {
  // The browser knows the visitor's language and time zone, unlike the server.
  const localTime = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(publishedAt));

  return (
    // Server and browser can use different time zones, so their first text can differ.
    <time
      dateTime={publishedAt}
      className="ml-auto text-right text-gray-600"
      suppressHydrationWarning
    >
      {localTime}
    </time>
  );
}

// A public updates panel. Its content comes from the simple config file above.
export default function ProjectUpdates() {
  // Timestamps decide the order, so a newly added update always appears first.
  const newestUpdates = [...projectUpdates].sort(
    (firstUpdate, secondUpdate) =>
      new Date(secondUpdate.publishedAt).getTime() -
      new Date(firstUpdate.publishedAt).getTime()
  );

  return (
    <section className="w-full max-w-5xl pb-20" aria-labelledby="updates-heading">
      <div className="content-card-border rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Keep in touch
            </p>
            <h2 id="updates-heading" className="mt-2 text-2xl font-bold sm:text-3xl">
              Updates
            </h2>
          </div>
          <p className="text-sm text-gray-600">What we are working on</p>
        </div>

        <div className="mt-5 space-y-4">
          {newestUpdates.map((update) => (
            <article key={`${update.publishedAt}-${update.title}`} className="content-card-border rounded-lg border border-gray-200 p-4">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-secondary px-2.5 py-1 font-semibold text-secondary-foreground">
                  {update.status}
                </span>
                <LocalUpdateTime publishedAt={update.publishedAt} />
              </div>
              <h3 className="mt-3 text-lg font-semibold">{update.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{update.message}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
