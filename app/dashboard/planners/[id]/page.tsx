import { notFound, redirect } from "next/navigation";

import { SavedPlannerActions } from "@/components/planner/SavedPlannerActions";
import { Planner } from "@/database/entities/Planner";
import { getCurrentUser } from "@/lib/auth";
import { connectDatabase } from "@/lib/database";

// A saved planner can be viewed only by the user who owns it.
export default async function SavedPlannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const plannerId = Number(id);

  if (!Number.isInteger(plannerId) || plannerId < 1) {
    notFound();
  }

  const database = await connectDatabase();
  const planner = await database.getRepository(Planner).findOne({
    where: { id: plannerId, user: { id: user.id } },
    relations: { sections: { activities: true } },
  });

  if (!planner) {
    notFound();
  }

  const actionPlanner = {
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
    <main className="min-h-screen bg-gray-100 p-6 sm:p-10">
      <article className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Saved planner</p>
            <h1 className="mt-1 text-3xl font-bold">{planner.title}</h1>
            <p className="mt-2 text-sm text-gray-500">
              Created {planner.createdAt.toLocaleDateString()}
            </p>
          </div>

          <SavedPlannerActions planner={actionPlanner} />
        </div>

        <div className="mt-10 space-y-6">
          {planner.sections.map((section) => (
            <section key={section.id} className="rounded-lg border p-5">
              <h2 className="text-xl font-semibold">
                {section.isBlank ? "Blank Section" : section.name}
              </h2>

              {section.activities.length === 0 ? (
                <p className="mt-3 text-gray-500">No activities in this section.</p>
              ) : (
                <ul className="mt-3 list-disc space-y-1 pl-5">
                  {section.activities.map((activity) => (
                    <li key={activity.id}>
                      {activity.isBlank ? "Blank Activity" : activity.name}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
