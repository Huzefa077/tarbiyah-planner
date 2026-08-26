import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DashboardPlannerActions } from "@/components/planner/DashboardPlannerActions";
import { DeletePlannerButton } from "@/components/planner/DeletePlannerButton";
import { GuestDashboard } from "@/components/planner/GuestDashboard";
import { Planner } from "@/database/entities/Planner";
import { getCurrentUser } from "@/lib/auth";
import { connectDatabase } from "@/lib/database";

// This is a server page for the /dashboard route.
// It can safely read the HTTP-only authentication cookie through getCurrentUser().
export default async function DashboardPage() {
  const user = await getCurrentUser();

  // Guests see their sessionStorage planners in a browser-side dashboard instead of PostgreSQL data.
  if (!user) {
    return <GuestDashboard />;
  }

  // Keep the saved full name, but make the greeting short and personal.
  const firstName = user.fullName.trim().split(/\s+/)[0] || "there";

  // Load this user's planners. The user condition ensures parents never see
  // planners that belong to another account.
  const database = await connectDatabase();
  const planners = await database.getRepository(Planner).find({
    where: { user: { id: user.id } },
    order: { createdAt: "DESC" },
    relations: { sections: { activities: true } },
  });

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold">
          Welcome, {firstName}
        </h1>

        <p className="mt-2 text-gray-600">
          Build consistent routines, track progress, and support positive habits one day at a time.
        </p>

        <section className="mt-12 rounded-xl bg-white p-6 shadow">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Recent Planners</h2>

            {/* Base UI uses render (rather than asChild) to style a Next.js Link as a button. */}
            <Button render={<Link href="/planner" />} nativeButton={false}>
              + Create Planner
            </Button>
          </div>

          {planners.length === 0 ? (
            <p className="mt-3 text-gray-500">No planners created yet.</p>
          ) : (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {planners.map((planner) => {
                // Convert TypeORM's entity into plain data before a client component receives it.
                const plannerForActions = {
                  id: planner.id,
                  title: planner.title,
                  sections: planner.sections.map((section) => ({
                    id: section.id,
                    name: section.name,
                    isBlank: section.isBlank,
                    isDefault: section.isDefault,
                    activities: section.activities.map((activity) => ({
                      id: activity.id,
                      name: activity.name,
                      isBlank: activity.isBlank,
                    })),
                  })),
                };

                return (
                  <li
                    key={planner.id}
                    className="relative rounded-lg border border-gray-200 p-4"
                  >
                    <p className="pr-16 font-semibold">{planner.title}</p>
                    <DeletePlannerButton
                      plannerId={planner.id}
                      plannerTitle={planner.title}
                      label="Delete"
                      className="absolute right-4 top-4"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Created {planner.createdAt.toLocaleDateString()}
                    </p>
                    <DashboardPlannerActions planner={plannerForActions} />
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
