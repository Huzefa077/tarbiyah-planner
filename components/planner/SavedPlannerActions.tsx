"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PlannerContext } from "@/context/PlannerContext";

type SavedPlanner = {
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

export function SavedPlannerActions({ planner }: { planner: SavedPlanner }) {
  const router = useRouter();
  const plannerContext = useContext(PlannerContext);

  if (!plannerContext) {
    throw new Error("PlannerContext not found");
  }

  // Keep a non-null reference that TypeScript can safely use inside editPlanner().
  const context = plannerContext;

  function editPlanner() {
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

    // Put the saved database data back into the client-side planner editor.
    context.setAvailableSections(sections);
    context.setSelectedSections(sections.map((section) => section.id));
    context.setActivities(activities);
    context.setEditingPlannerId(planner.id);
    context.setPlannerTitle(planner.title);
    router.push("/planner/sections");
  }

  return (
    <div className="no-print flex flex-wrap gap-3">
      <Button onClick={editPlanner}>Edit planner</Button>
      {/* <Button variant="outline" onClick={() => window.print()}>
        Print planner
      </Button> */}
    </div>
  );
}
