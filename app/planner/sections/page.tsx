"use client"; // This page runs in the browser and can use interactive React features.

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { PlannerContext } from "@/context/PlannerContext";
import { Button } from "@/components/ui/button";

// Built-in sections provided by the application.
// These cannot be deleted by the user.
const defaultSections = [
    "Learn & Read",
    "Good Deeds",
    "Exercise",
    "Family Time",
];

export default function SectionsPage() {
    const planner = useContext(PlannerContext);

    if (!planner) {
        throw new Error("PlannerContext not found");
    }

    const { selectedSections, setSelectedSections } = planner;
    const router = useRouter();

    // Stores every section shown in the list.
    // Starts with the built-in sections but later also contains custom ones.
    const [availableSections, setAvailableSections] =
        useState<string[]>(defaultSections);

    // Stores the current value typed into the custom section textbox.
    const [customSection, setCustomSection] = useState("");

    // Select or unselect a section.
    // Users can select a maximum of 4 sections.
    function toggleSection(section: string) {
        if (selectedSections.includes(section)) {
            // Remove the section if it is already selected.
            setSelectedSections(
                selectedSections.filter(
                    (item) => item !== section
                )
            );
        } else {
           // Users can select a maximum of 3 sections.
// Prayer Routine is already included, making 4 sections in total.
if (selectedSections.length >= 3) return;
            // Add the newly selected section.
            setSelectedSections([
                ...selectedSections,
                section,
            ]);
        }
    }

    // Delete a custom section.
    // Also remove it from the selected list if it was checked.
    function removeSection(section: string) {
        setAvailableSections(
            availableSections.filter(
                (item) => item !== section
            )
        );

        setSelectedSections(
            selectedSections.filter(
                (item) => item !== section
            )
        );
    }

    // Create a new custom section.
    function addCustomSection() {
        // Remove extra spaces before validation.
        const trimmedSection = customSection.trim();

        // Ignore empty input.
        if (!trimmedSection) return;

        // Prevent duplicate section names.
        if (availableSections.includes(trimmedSection)) return;

        // Add the new section to the available list.
        setAvailableSections([
            ...availableSections,
            trimmedSection,
        ]);

        // Automatically select the new section if there is room.
       if (selectedSections.length < 3) {
            setSelectedSections([
                ...selectedSections,
                trimmedSection,
            ]);
        }

        // Clear the input field for the next entry.
        setCustomSection("");
    }

    return (
        <main className="min-h-screen bg-gray-100 flex justify-center py-12">
            <div className="w-full max-w-3xl rounded-xl bg-white p-8 shadow">

                <h1 className="text-3xl font-bold">
                    Create Planner
                </h1>

                <p className="text-gray-500 mt-2">
                    Step 2 of 3
                </p>

                <h2 className="text-xl font-semibold mt-8">
                    Choose up to 3 Sections
                </h2>

                {/* Prayer is always included in every planner. */}
                <p className="text-green-600 mt-2">
                    ✓ Prayer Routine (Always Included)
                </p>

                {/* Display every available section as a selectable row. */}
                <div className="mt-8 space-y-3">

                    {availableSections.map((section) => {
                        // Check whether this is a built-in section.
                        // Built-in sections cannot be deleted.
                        const isDefault = defaultSections.includes(section);

                        return (
                            <div
                                key={section}
                                className="flex items-center justify-between border rounded-lg p-4"
                            >
                                <label className="flex items-center gap-3 cursor-pointer flex-1">

                                    <input
                                        type="checkbox"
                                        checked={selectedSections.includes(section)}
                                        onChange={() =>
                                            toggleSection(section)
                                        }
                                    />

                                    <span>{section}</span>

                                </label>

                                {/* Show the delete button only for custom sections. */}
                                {!isDefault && (
                                    <button
                                        type="button"
                                        className="text-red-500 font-bold text-lg px-2"
                                        onClick={() =>
                                            removeSection(section)
                                        }
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        );
                    })}

                </div>

                {/* Input for creating a custom section. */}
                <div className="flex flex-col gap-5 mt-5">

                    <label className="bg-gray-100 p-3 border-2 rounded-lg">

                        <input
                            type="text"
                            placeholder="Enter Custom Section"
                            value={customSection}
                            className="w-full bg-transparent outline-none"
                            onChange={(e) =>
                                setCustomSection(e.target.value)
                            }
                        />

                    </label>

                    {/* Add the custom section to the list. */}
                    <Button
                        className="p-5"
                        onClick={addCustomSection}
                        disabled={!customSection.trim()}
                    >
                        + Add
                    </Button>

                </div>

                {/* Display how many sections are currently selected. */}
                <p className="mt-6">
                    Selected {selectedSections.length}  / 3
                </p>
                <Button
                    className="mt-8"
                    disabled={selectedSections.length === 0}
                    onClick={() => router.push("/planner/configure")}
                >
                    Continue
                </Button>

            </div>
        </main>
    );
}