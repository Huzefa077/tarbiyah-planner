"use client";

// Dashboard cards use this client component to restore a saved planner before editing it.
import { useContext } from "react";
import { useRouter } from "next/navigation";

import { PlannerContext } from "@/context/PlannerContext";
import { usePageLoader } from "@/components/common/PageLoader";

type PlannerForDashboard = {
  id: number;
  title: string;
  sections: Array<{
    id: number;
    name: string;
    isBlank: boolean;
    isDefault: boolean;
    activities: Array<{ id: number; name: string; isBlank: boolean }>;
  }>;
};

export function DashboardPlannerActions({
  planner,
}: {
  planner: PlannerForDashboard;
}) {
  const router = useRouter();
  const { startLoading } = usePageLoader();
  const plannerContext = useContext(PlannerContext);

  if (!plannerContext) {
    throw new Error("PlannerContext not found");
  }

  // This separate name keeps TypeScript's null check valid inside editPlanner().
  const context = plannerContext;

  function openPlanner(destination: "/planner/sections" | "/planner/preview") {
    const sections = planner.sections.map((section) => ({
      id: String(section.id),
      name: section.name,
      isBlank: section.isBlank,
      isDefault: section.isDefault,
    }));

    const activities = Object.fromEntries(
      planner.sections.map((section) => [
        String(section.id),
        section.activities.map((activity) => ({
          id: String(activity.id),
          name: activity.name,
          isBlank: activity.isBlank,
        })),
      ])
    );

    // Restore saved database data into the shared state before opening a wizard page.
    context.setAvailableSections(sections);
    context.setSelectedSections(sections.map((section) => section.id));
    context.setActivities(activities);
    context.setEditingPlannerId(planner.id);
    context.setPlannerTitle(planner.title);
    startLoading();
    router.push(destination);
  }

  function editPlanner() {
    openPlanner("/planner/sections");
  }

  function previewPlanner() {
    openPlanner("/planner/preview");
  }

  return (
    <div className="mt-3 flex items-center gap-4 text-sm font-medium">
      <button
        type="button"
        onClick={previewPlanner}
        className="text-blue-800 hover:underline dark:text-blue-300"
      >
        Preview
      </button>

      <button
        type="button"
        onClick={editPlanner}
        className="text-blue-800 hover:underline dark:text-blue-300"
      >
        Edit planner
      </button>
    </div>
  );
}
