"use client";

import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { PlannerContext } from "@/context/PlannerContext";
import { Button } from "@/components/ui/button";

function createId(prefix: string) {
    return `${prefix}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`;
}

export default function ConfigurePage() {
    const router = useRouter();

    const planner = useContext(PlannerContext);

    if (!planner) {
        throw new Error("PlannerContext not found");
    }

    const {
        availableSections,
        selectedSections,
        activities,
        setActivities,
    } = planner;

    /*
    Convert selected section IDs into actual section objects.

    We keep the order in which the parent selected them.
    */
    const selectedSectionObjects = selectedSections
        .map((sectionId) =>
            availableSections.find(
                (section) => section.id === sectionId
            )
        )
        .filter((section) => section !== undefined);

    /*
    Stores the text currently being typed for each section.

    Example:

    {
        "learn-read": "Quran Reading",
        "exercise": "Running"
    }

    Each section gets its own input value.
    */
    const [activityInputs, setActivityInputs] =
        useState<Record<string, string>>({});

    /*
    There are already 5 fixed prayer activities:

    Fajr
    Dhuhr
    Asr
    Maghrib
    Isha

/*
The planner allows the parent to add
a maximum of 15 activities in total.

These activities are independent of the
5 fixed prayer rows shown in the preview.

Blank activities also count toward this limit.
*/

    const MAX_TOTAL_ACTIVITIES = 11;

    /*
    Count all activities currently added by the parent
    across all selected sections.
    */
    const customActivityCount = Object.values(
        activities
    ).reduce(
        (total, sectionActivities) =>
            total + sectionActivities.length,
        0
    );

    const remainingActivitySlots =
        MAX_TOTAL_ACTIVITIES - customActivityCount;

    /*
    Add a normal activity.
    */
    function addActivity(sectionId: string) {
        const activityName =
            activityInputs[sectionId]?.trim();

        // Ignore empty input.
        if (!activityName) return;

        // Do not allow more than 15 custom activities.
        if (remainingActivitySlots <= 0) return;

        const newActivity = {
            id: createId("activity"),
            name: activityName,
            isBlank: false,
        };

        setActivities((currentActivities) => ({
            ...currentActivities,

            [sectionId]: [
                ...(currentActivities[sectionId] || []),
                newActivity,
            ],
        }));

        // Clear only this section's input.
        setActivityInputs((currentInputs) => ({
            ...currentInputs,
            [sectionId]: "",
        }));
    }

    /*
    Add a blank activity.

    The parent does not need to type "-".

    Every click creates a separate activity with
    its own unique ID.

    Blank activities also count toward the
    5 custom activity limit.
    */
    function addBlankActivity(sectionId: string) {
        // Do not allow more than 5 custom activities.
        if (remainingActivitySlots <= 0) return;

        const newActivity = {
            id: createId("blank-activity"),
            name: "",
            isBlank: true,
        };

        setActivities((currentActivities) => ({
            ...currentActivities,

            [sectionId]: [
                ...(currentActivities[sectionId] || []),
                newActivity,
            ],
        }));
    }

    /*
    Remove an activity.
    */
    function removeActivity(
        sectionId: string,
        activityId: string
    ) {
        setActivities((currentActivities) => ({
            ...currentActivities,

            [sectionId]: (
                currentActivities[sectionId] || []
            ).filter(
                (activity) =>
                    activity.id !== activityId
            ),
        }));
    }

    return (
        <main className="min-h-screen bg-gray-100 p-10">

            <h1 className="text-3xl font-bold">
                Configure Planner
            </h1>

            <p className="mt-2 text-gray-500">
                Add activities for every section.
            </p>

            {/* Activity counter */}
            <div className="mt-4 rounded-lg border bg-white p-4">
                <p className="font-medium">
                    Activities:{" "}
                    {customActivityCount} / {MAX_TOTAL_ACTIVITIES}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                    You can add{" "}
                    {remainingActivitySlots} more{" "}
                    {remainingActivitySlots === 1
                        ? "activity"
                        : "activities"}.
                </p>
            </div>

            <div className="mt-8 space-y-6">

                {selectedSectionObjects.map((section) => {

                    const sectionActivities =
                        activities[section.id] || [];

                    const noSlotsLeft =
                        remainingActivitySlots <= 0;

                    return (

                        <div
                            key={section.id}
                            className="rounded-xl border bg-white p-6 shadow"
                        >

                            {/* Section title */}
                            <h2 className="text-xl font-semibold">

                                {section.isBlank ? (

                                    <span className="text-gray-500">
                                        Blank Section
                                    </span>

                                ) : (

                                    section.name

                                )}

                            </h2>

                            {/* Activity input */}
                            <p className="mt-4 mb-2">
                                Activity
                            </p>

                            <input
                                type="text"
                                placeholder="Enter activity"
                                className="w-full rounded border p-2 outline-none"
                                value={
                                    activityInputs[
                                    section.id
                                    ] || ""
                                }
                                disabled={noSlotsLeft}
                                onChange={(e) =>
                                    setActivityInputs(
                                        (currentInputs) => ({
                                            ...currentInputs,
                                            [section.id]:
                                                e.target.value,
                                        })
                                    )
                                }
                            />

                            {/* Activity buttons */}
                            <div className="mt-4 flex gap-3">

                                <Button
                                    onClick={() =>
                                        addActivity(
                                            section.id
                                        )
                                    }
                                    disabled={
                                        noSlotsLeft ||
                                        !activityInputs[
                                            section.id
                                        ]?.trim()
                                    }
                                >
                                    + Add Activity
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        addBlankActivity(
                                            section.id
                                        )
                                    }
                                    disabled={
                                        noSlotsLeft
                                    }
                                >
                                    + Add Blank Activity
                                </Button>

                            </div>

                            {/* Saved activities */}
                            <div className="mt-6">

                                <h3 className="font-semibold">
                                    Activities
                                </h3>

                                {sectionActivities.length ===
                                    0 ? (

                                    <p className="mt-2 text-gray-500">
                                        No activities yet.
                                    </p>

                                ) : (

                                    <ul className="mt-2 space-y-2">

                                        {sectionActivities.map(
                                            (activity) => (

                                                <li
                                                    key={
                                                        activity.id
                                                    }
                                                    className="flex items-center justify-between rounded border border-gray-200 bg-gray-50 p-2"
                                                >

                                                    <span>

                                                        {activity.isBlank ? (

                                                            <span className="text-gray-500">
                                                                Blank Activity
                                                            </span>

                                                        ) : (

                                                            activity.name

                                                        )}

                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeActivity(
                                                                section.id,
                                                                activity.id
                                                            )
                                                        }
                                                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                                                    >
                                                        Remove
                                                    </button>

                                                </li>

                                            )
                                        )}

                                    </ul>

                                )}

                            </div>

                        </div>

                    );
                })}

            </div>

            {/* Navigation */}
            <div className="mt-10 flex justify-between">

                <Button
                    variant="outline"
                    onClick={() =>
                        router.push(
                            "/planner/sections"
                        )
                    }
                >
                    ← Back
                </Button>

                <Button
                    onClick={() =>
                        router.push(
                            "/planner/preview"
                        )
                    }
                >
                    Continue →
                </Button>

            </div>

        </main>
    );
}