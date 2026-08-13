import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Planner } from "@/database/entities/Planner";
import { getCurrentUser } from "@/lib/auth";
import { connectDatabase } from "@/lib/database";

// This is a server page for the /dashboard route.
// It can safely read the HTTP-only authentication cookie through getCurrentUser().
export default async function DashboardPage() {
  const user = await getCurrentUser();

  // A visitor without a valid login cookie cannot view the dashboard.
  if (!user) {
    redirect("/login");
  }

  // Load this user's planners. The user condition ensures parents never see
  // planners that belong to another account.
  const database = await connectDatabase();
  const planners = await database.getRepository(Planner).find({
    where: { user: { id: user.id } },
    order: { createdAt: "DESC" },
  });

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold">
          Assalamu Alaikum, {user.fullName}
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome back. Create a planner to begin tracking daily routines.
        </p>

        <div className="mt-10">
          {/* Base UI uses render (rather than asChild) to style a Next.js Link as a button. */}
          <Button render={<Link href="/planner" />} nativeButton={false}>
            + Create Planner
          </Button>
        </div>

        <section className="mt-12 rounded-xl bg-white p-6 shadow">
          <h2 className="text-2xl font-semibold">Recent Planners</h2>

          {planners.length === 0 ? (
            <p className="mt-3 text-gray-500">No planners created yet.</p>
          ) : (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {planners.map((planner) => (
                <li
                  key={planner.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <p className="font-semibold">{planner.title}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Created {planner.createdAt.toLocaleDateString()}
                  </p>
                  <Link
                    href={`/dashboard/planners/${planner.id}`}
                    className="mt-3 inline-block text-sm font-medium text-blue-700 hover:underline"
                  >
                    View planner
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
