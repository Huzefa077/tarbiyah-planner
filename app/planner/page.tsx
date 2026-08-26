// This page needs to react to clicks and remember a selected option in the browser.
// "use client" tells Next.js to run this component on the client (the browser).
"use client";

import { useRouter } from "next/navigation";

// Import the reusable styled button from this project.
import { Button } from "@/components/ui/button";
// Import React's useState Hook, which lets a component remember changing data.
import { useContext, useEffect, useState } from "react";
import { PlannerContext } from "@/context/PlannerContext";
import { usePageLoader } from "@/components/common/PageLoader";

// app/planner/page.tsx is the page shown at the URL: /planner
export default function PlannerPage() {
    // ageGroup = the currently selected radio-button value, starting as an empty string.
    // setAgeGroup = the function used to change ageGroup after the user clicks an option.
    const [ageGroup, setAgeGroup] = useState("");
    const router = useRouter();
    const { startLoading } = usePageLoader();
    const planner = useContext(PlannerContext);

    if (!planner) {
        throw new Error("PlannerContext not found");
    }

    const { resetPlanner } = planner;

    // Reaching /planner always starts a fresh planner instead of editing the last one.
    useEffect(() => {
        resetPlanner();
    }, [resetPlanner]);

    return (
        // Page layout:
        // min-h-screen = at least the full browser-window height.
        // bg-gray-100 = a very light-gray page background.
        // flex = use Flexbox layout.
        // justify-center = centre the card horizontally.
        // py-12 = add 48px of padding above and below the card.
        <main className="min-h-screen bg-gray-100 flex justify-center py-12">

            {/* Planner card
          w-full = use all available width on a narrow screen.
          max-w-3xl = stop growing after Tailwind's 3xl maximum width.
          rounded-xl = give the card rounded corners.
          bg-white = use a white card background.
          p-8 = add 32px of inside padding.
          shadow = add a subtle shadow around the card. */}
            <div className="w-full max-w-3xl rounded-xl bg-white p-8 shadow">

                {/* Main page heading: text-3xl makes it large; font-bold makes it bold. */}
                <h1 className="text-3xl font-bold">
                    Create Planner
                </h1>

                {/* Step label: mt-2 gives it 8px space above; text-gray-500 uses medium-gray text. */}
                <p className="mt-2 text-gray-500">
                    Step 1 of 3
                </p>

                {/* mt-10 gives this whole age-selection section 40px of space above it. */}
                <div className="mt-10">

                    {/* Section heading: font-semibold is between normal and bold; text-xl is a larger font. */}
                    <h2 className="font-semibold text-xl">
                        Select Age Group
                    </h2>

                    {/* Options list: mt-6 adds 24px above it; space-y-4 adds 16px between each label. */}
                    <div className="mt-6 space-y-4">

                        {/* First radio option
                flex = arrange the radio circle and text in one row.
                items-center = align that row vertically in the middle.
                gap-3 = leave 12px between the radio circle and text.
                border = draw a thin border.
                rounded-lg = give it rounded corners.
                p-4 = add 16px of inside padding. */}
                        <label className="flex items-center gap-3 border rounded-lg p-4">

                            {/* type=radio makes a selectable circle. Matching name="age" means only one age can be selected.
                  When this option is selected, save its value ("5-8") in ageGroup. */}
                            <input
                                type="radio"
                                name="age"
                                value="5-8"
                                onChange={(e) => setAgeGroup(e.target.value)}
                            />

                            5 - 8 Years

                        </label>

                        {/* This second option uses the same layout classes as the first one. */}
                        <label className="flex items-center gap-3 border rounded-lg p-4">

                            {/* When this option is selected, save its value ("9-12") in ageGroup. */}
                            <input
                                type="radio"
                                name="age"
                                value="9-12"
                                onChange={(e) => setAgeGroup(e.target.value)}
                            />

                            9 - 12 Years

                        </label>

                    </div>

                </div>

                {/* Continue button
            mt-10 = add 40px of space above the button.
            disabled={!ageGroup} = disable the button while ageGroup is empty.
            Once a radio option changes ageGroup to "5-8" or "9-12", the button becomes enabled. */}
                <Button
                    className="mt-10"
                    disabled={!ageGroup}
                    onClick={() => {
                        startLoading();
                        router.push("/planner/sections");
                    }}
                >
                    Continue
                </Button>

            </div>
        </main>
    );
}
