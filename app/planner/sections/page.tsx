"use client";

// ROUTE: /planner/sections — second wizard step, where a parent chooses planner sections.
import {
    useContext,
    useEffect,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import {
    PlannerContext,
    PlannerSection,
} from "@/context/PlannerContext";

import { Button } from "@/components/ui/button";
import { usePageLoader } from "@/components/common/PageLoader";

const DEFAULT_SECTIONS: PlannerSection[] = [
    {
        id: "prayers",
        name: "Prayer",
        isBlank: false,
        isDefault: true,
    },
    {
        id: "learn-read",
        name: "Learn & Read",
        isBlank: false,
        isDefault: true,
    },
    {
        id: "good-deeds",
        name: "Good Deeds",
        isBlank: false,
        isDefault: true,
    },
    {
        id: "exercise",
        name: "Exercise",
        isBlank: false,
        isDefault: true,
    },
    {
        id: "family-time",
        name: "Family Time",
        isBlank: false,
        isDefault: true,
    },
];

function createId(prefix: string) {
    return `${prefix}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`;
}

export default function SectionsPage() {
    const planner = useContext(PlannerContext);

    if (!planner) {
        throw new Error("PlannerContext not found");
    }

    const {
        availableSections,
        setAvailableSections,
        selectedSections,
        setSelectedSections,
        setActivities,
    } = planner;
    
    const router = useRouter();
    const { startLoading } = usePageLoader();

    useEffect(() => {
        if (availableSections.length === 0) {
            setAvailableSections(DEFAULT_SECTIONS);
        }
    }, [
        availableSections.length,
        setAvailableSections,
    ]);
    

    // Stores the text typed into the custom section input.
    const [customSection, setCustomSection] = useState("");

    // Select / unselect a section.
    function toggleSection(sectionId: string) {
        if (selectedSections.includes(sectionId)) {
            setSelectedSections(
                selectedSections.filter(
                    (id) => id !== sectionId
                )
            );

            /*
            An unselected section will not be saved or displayed.
            Its activities must leave the shared state too; otherwise the
            activity counter would still count activities the parent removed.
            */
            setActivities((currentActivities) => {
                const updatedActivities = {
                    ...currentActivities,
                };

                delete updatedActivities[sectionId];

                return updatedActivities;
            });

            return;
        }

        if (selectedSections.length >= 4) return;

        setSelectedSections([
            ...selectedSections,
            sectionId,
        ]);
    }

    // Delete a section.
    function removeSection(sectionId: string) {
        // Remove it from available sections.
        setAvailableSections(
            availableSections.filter(
                (section) => section.id !== sectionId
            )
        );

        // Remove it from selected sections.
        setSelectedSections(
            selectedSections.filter(
                (id) => id !== sectionId
            )
        );

        // Remove activities belonging to this section.
        setActivities((currentActivities) => {

            const updatedActivities = {
                ...currentActivities,
            };

            delete updatedActivities[sectionId];

            return updatedActivities;
        });
    }

    // Add a normal custom section.
    function addCustomSection() {
        const trimmedSection =
            customSection.trim();

        // Ignore empty input.
        if (!trimmedSection) return;

        // Prevent duplicate normal section names.
        const alreadyExists =
            availableSections.some(
                (section) =>
                    !section.isBlank &&
                    section.name === trimmedSection
            );

        if (alreadyExists) return;

        const newSection = {
            id: createId("section"),
            name: trimmedSection,
            isBlank: false,
            isDefault: false,
        };

        setAvailableSections([
            ...availableSections,
            newSection,
        ]);

        // Automatically select if there is room.
        if (selectedSections.length < 4) {
            setSelectedSections([
                ...selectedSections,
                newSection.id,
            ]);
        }

        setCustomSection("");
    }

    // Add a blank section.
    //
    // The user does NOT type "-".
    //
    // Every click creates a completely separate section
    // because every section gets a unique ID.
    function addBlankSection() {
        const newSection = {
            id: createId("blank-section"),
            name: "",
            isBlank: true,
            isDefault: false,
        };

        setAvailableSections([
            ...availableSections,
            newSection,
        ]);

        // Automatically select if there is room.
        if (selectedSections.length < 4) {
            setSelectedSections([
                ...selectedSections,
                newSection.id,
            ]);
        }
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
                    Choose up to 4 Sections
                </h2>

                {/* Available sections */}
                <div className="mt-8 space-y-3">

                    {availableSections.map((section) => (

                        <div
                            key={section.id}
                            className="flex items-center justify-between border rounded-lg p-4"
                        >

                            <label className="flex items-center gap-3 cursor-pointer flex-1">

                                <input
                                    type="checkbox"
                                    checked={selectedSections.includes(
                                        section.id
                                    )}
                                    onChange={() =>
                                        toggleSection(section.id)
                                    }
                                />

                                {section.isBlank ? (
                                    <span className="text-gray-500">
                                        Blank Section
                                    </span>
                                ) : (
                                    <span>
                                        {section.name}
                                    </span>
                                )}
                            </label>

                            {/* Built-in sections cannot be deleted. */}
                            {!section.isDefault && (

                                <button
                                    type="button"
                                    className="text-red-500 font-bold text-lg px-2"
                                    onClick={() =>
                                        removeSection(section.id)
                                    }
                                >
                                    ✕
                                </button>

                            )}

                        </div>

                    ))}

                </div>

                {/* Custom section input */}
                <div className="mt-6">

                    <label className="block bg-gray-100 p-3 border-2 rounded-lg">

                        <input
                            type="text"
                            placeholder="Enter Custom Section"
                            value={customSection}
                            className="w-full bg-transparent outline-none"
                            onChange={(e) =>
                                setCustomSection(e.target.value)
                            }
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    addCustomSection();
                                }
                            }}
                        />

                    </label>

                </div>

                {/* Section buttons */}
                <div className="flex gap-3 mt-4">

                    <Button
                        onClick={addCustomSection}
                        disabled={!customSection.trim()}
                    >
                        + Add Section
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={addBlankSection}
                    >
                        + Add Blank Section
                    </Button>

                </div>

                {/* Selected count */}
                <p className="mt-6">
                    Selected {selectedSections.length}/4
                </p>

                <Button
                    className="mt-8"
                    onClick={() => {
                        startLoading();
                        router.push("/planner/activities");
                    }}
                >
                    Continue
                </Button>

            </div>

        </main>
    );
}
