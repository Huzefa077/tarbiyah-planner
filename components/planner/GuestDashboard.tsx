"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";

import { Button } from "@/components/ui/button";
import { usePageLoader } from "@/components/common/PageLoader";
import { DashboardLayout } from "@/components/planner/DashboardLayout";
import { GuestPlanner, PlannerContext } from "@/context/PlannerContext";

// Dashboard shown to an unsigned guest. Its planners stay only in browser sessionStorage.
export function GuestDashboard() {
  const router = useRouter();
  const { startLoading } = usePageLoader();
  const planner = useContext(PlannerContext);

  if (!planner) {
    throw new Error("PlannerContext not found");
  }

  const { deleteGuestPlanner, guestPlanners, loadGuestPlanner } = planner;

  function openGuestPlanner(guestPlanner: GuestPlanner, destination: string) {
    loadGuestPlanner(guestPlanner);
    startLoading();
    router.push(destination);
  }

  function removeGuestPlanner(guestPlanner: GuestPlanner) {
    const shouldDelete = window.confirm(
      "Delete the temporary planner \"" + guestPlanner.title + "\"?"
    );

    if (shouldDelete) {
      deleteGuestPlanner(guestPlanner.id);
    }
  }

  return (
    <DashboardLayout
      greeting="Welcome, Guest"
      hasPlanners={guestPlanners.length > 0}
      notice={
        <section className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
          <p className="font-semibold">Guest planners are temporary.</p>
          <p className="mt-1 text-sm">
            They stay in this browser tab and survive refreshes, but are removed when the browser session ends. Sign in to save planners permanently.
          </p>
          <Link className="mt-3 inline-block text-sm font-semibold underline underline-offset-4" href="/login">
            Sign in to save permanently
          </Link>
        </section>
      }
    >
      {guestPlanners.map((guestPlanner) => (
        <li className="content-card-border relative rounded-lg border border-gray-200 p-4" key={guestPlanner.id}>
          <p className="pr-16 font-semibold">{guestPlanner.title}</p>
          <Button
            className="absolute right-4 top-4 border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => removeGuestPlanner(guestPlanner)}
            type="button"
            variant="outline"
          >
            Delete
          </Button>
          <p className="mt-1 text-sm text-gray-500">
            Created {new Date(guestPlanner.createdAt).toLocaleDateString()}
          </p>

          <div className="mt-3 flex items-center gap-4 text-sm font-medium">
            <button
              className="text-blue-800 hover:underline dark:text-blue-300"
              onClick={() => openGuestPlanner(guestPlanner, "/planner/preview")}
              type="button"
            >
              Preview
            </button>
            <button
              className="text-blue-800 hover:underline dark:text-blue-300"
              onClick={() => openGuestPlanner(guestPlanner, "/planner/sections")}
              type="button"
            >
              Edit planner
            </button>
          </div>
        </li>
      ))}
    </DashboardLayout>
  );
}
