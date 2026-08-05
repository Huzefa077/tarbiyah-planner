"use client";

import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { PlannerContext } from "@/context/PlannerContext";
import { Button } from "@/components/ui/button";

export default function ConfigurePage() {
    const router = useRouter();

    // Read shared planner data from Context.
    const planner = useContext(PlannerContext);

    // Safety check.
    if (!planner) {
        throw new Error("PlannerContext not found");
    }

    // Get the selected sections.
    const {
        selectedSections,
        activities,
        setActivities,
    } = planner;

    // Stores the text currently being typed for EACH section.
    //
    // Example:
    // {
    //   "Learn & Read": "Quran Reading",
    //   "Exercise": "Running"
    // }
    const [activityInputs, setActivityInputs] = useState<{
        [key: string]: string;
    }>({});

    // Stores all saved activities for EACH section.
    //
    // Example:
    // {
    //   "Learn & Read": [
    //      "Quran Reading",
    //      "Homework"
    //   ],
    //
    //   "Exercise": [
    //      "Running"
    //   ]
    // }

    // Adds one activity to a specific section.
    function addActivity(section: string) {
        // Read what the user typed for this section.
        const activity = activityInputs[section]?.trim();

        // Ignore empty activities.
        if (!activity) return;

        // Save the activity.
        setActivities({
            ...activities,

            [section]: [
                ...(activities[section] || []),
                activity,
            ],
        });

        // Clear only this section's textbox.
        setActivityInputs({
            ...activityInputs,

            [section]: "",
        });
    }

    return (
        <main className="min-h-screen bg-gray-100 p-10">
            <h1 className="text-3xl font-bold">
                Configure Planner
            </h1>

            <p className="mt-2 text-gray-500">
                Add activities for every section.
            </p>

            <div className="mt-8 space-y-6">

                {selectedSections.map((section) => (

                    <div
                        key={section}
                        className="rounded-xl bg-white border shadow p-6"
                    >

                        {/* Section Title */}
                        <h2 className="text-xl font-semibold">
                            {section}
                        </h2>

                        {/* Input Label */}
                        <p className="mt-4 mb-2">
                            Activity
                        </p>

                        {/* Activity Input */}
                        <input
                            type="text"
                            placeholder="Enter activity"
                            className="w-full rounded border p-2 outline-none"
                            value={activityInputs[section] || ""}
                            onChange={(e) =>
                                setActivityInputs({
                                    ...activityInputs,
                                    [section]: e.target.value,
                                })
                            }
                        />

                        {/* Add Button */}
                        <Button
                            className="mt-4"
                            onClick={() => addActivity(section)}
                        >
                            + Add Activity
                        </Button>

                        {/* Saved Activities */}
                        <div className="mt-6">

                            <h3 className="font-semibold">
                                Activities
                            </h3>

                            {(activities[section] || []).length === 0 ? (

                                <p className="mt-2 text-gray-500">
                                    No activities yet.
                                </p>

                            ) : (

                                <ul className="mt-2 ml-6 list-disc">

                                    {activities[section].map(
                                        (activity: string, index: number) => (

                                            <li key={index}>
                                                {activity}
                                            </li>

                                        )
                                    )}

                                </ul>

                            )}

                        </div>

                    </div>

                ))}

            </div>

            <div className="mt-10 flex justify-between">

                <Button
                    variant="outline"
                    onClick={() => router.push("/planner/sections")}
                >
                    ← Back
                </Button>

                <Button
                    onClick={() => router.push("/planner/preview")}
                >
                    Continue →
                </Button>

            </div>

        </main>
    );
}