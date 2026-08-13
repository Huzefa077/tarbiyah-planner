"use client";

import { useContext, useMemo, useState } from "react";
import { PlannerContext } from "@/context/PlannerContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

function getDaysInMonth(monthIndex: number) {
    return new Date(
        2024,
        monthIndex + 1,
        0
    ).getDate();
}

function BlankLine({
    minWidth = "4rem",
}: {
    minWidth?: string;
}) {
    return (
        <span
            className="inline-block"
            style={{ minWidth }}
        >
            &nbsp;
        </span>
    );
}

function DayColumns({
    dayCount,
}: {
    dayCount: number;
}) {
    return (
        <>
            {Array.from(
                { length: dayCount },
                (_, day) => (
                    <col
                        key={day}
                        className="planner-day-col"
                    />
                )
            )}
        </>
    );
}

function DayHeaderCells({
    dayCount,
}: {
    dayCount: number;
}) {
    return (
        <>
            {Array.from(
                { length: dayCount },
                (_, day) => (
                    <th
                        key={day}
                        className="planner-day-cell border border-black p-0 font-semibold"
                    >
                        {day + 1}
                    </th>
                )
            )}
        </>
    );
}

function DayCheckboxCells({
    dayCount,
}: {
    dayCount: number;
}) {
    return (
        <>
            {Array.from(
                { length: dayCount },
                (_, day) => (
                    <td
                        key={day}
                        className="planner-day-cell border border-black p-0 align-middle"
                    >
                        <div className="planner-checkbox" />
                    </td>
                )
            )}
        </>
    );
}

function StarShape({
    number,
}: {
    number: number;
}) {
    return (
        <div className="relative flex aspect-square items-center justify-center text-[30px] leading-none">
            <span>☆</span>

            <span className="absolute inset-0 flex items-center justify-center text-[8px] leading-none">
                {number}
            </span>
        </div>
    );
}

function DailyStarsGrid({
    dayCount,
}: {
    dayCount: number;
}) {
    const totalRows = 3;

    const perRow = Math.ceil(
        dayCount / totalRows
    );

    const rows = Array.from(
        { length: totalRows },
        (_, rowIndex) => {
            const start =
                rowIndex * perRow + 1;

            const end = Math.min(
                start + perRow - 1,
                dayCount
            );

            const count =
                end - start + 1;

            return {
                start,
                count,
            };
        }
    ).filter(
        (row) => row.count > 0
    );

    return (
        <div className="flex h-full flex-col justify-around p-1">
            {rows.map((row) => (
                <div
                    key={row.start}
                    className="grid gap-1"
                    style={{
                        gridTemplateColumns:
                            `repeat(${row.count}, minmax(0, 1fr))`,
                    }}
                >
                    {Array.from(
                        { length: row.count },
                        (_, index) => {
                            const day =
                                row.start + index;

                            return (
                                <StarShape
                                    key={day}
                                    number={day}
                                />
                            );
                        }
                    )}
                </div>
            ))}
        </div>
    );
}

function WeeklyRewardGrid() {
    const weeks = [
        "Week 1",
        "Week 2",
        "Week 3",
        "Week 4",
    ];

    return (
        <div className="absolute inset-1 grid grid-cols-2 grid-rows-2 gap-1">
            {weeks.map((week) => (
                <div
                    key={week}
                    className="flex items-start justify-center rounded-sm border border-black/20 px-1 pt-2 text-[10px]"
                >
                    <span className="font-semibold leading-none">
                        {week}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default function PreviewPage() {
    const router = useRouter();

    const planner =
        useContext(PlannerContext);

    const [
        selectedMonth,
        setSelectedMonth,
    ] = useState(
        new Date().getMonth()
    );

    const [
        paperSize,
        setPaperSize,
    ] = useState<"A4" | "A3">("A4");

    const [title, setTitle] = useState(planner?.plannerTitle ?? "");
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [saveSuccess, setSaveSuccess] = useState("");

    if (!planner) {
        throw new Error(
            "PlannerContext not found"
        );
    }

    const {
        availableSections,
        selectedSections,
        activities,
        editingPlannerId,
        setEditingPlannerId,
        setPlannerTitle,
    } = planner;

    const dayCount = useMemo(
        () =>
            getDaysInMonth(
                selectedMonth
            ),
        [selectedMonth]
    );

    const monthName =
        MONTH_NAMES[selectedMonth];

    /*
     * Convert selected section IDs
     * into actual section objects.
     */
    const selectedSectionObjects =
        selectedSections
            .map((sectionId) =>
                availableSections.find(
                    (section) =>
                        section.id ===
                        sectionId
                )
            )
            .filter(
                (section) =>
                    section !== undefined
            );

    /*
     * Count every custom activity.

     * Maximum = 11 activities.
     */
    const totalActivities =
        selectedSectionObjects.reduce(
            (total, section) =>
                total +
                (
                    activities[
                    section.id
                    ] || []
                ).length,
            0
        );

    /*
     * Calculate the row height.

     * The available printable height is
     * larger for A3 than A4.

     * Fewer activities:
     * → taller rows

     * More activities:
     * → shorter rows
     */
    const trackerHeight =
        paperSize === "A4"
            ? 108
            : 195;

    const headerHeight = 8;

    const activityRowHeight =
        totalActivities > 0
            ? (trackerHeight - headerHeight) /
            totalActivities
            : trackerHeight - headerHeight;

    async function handleSave() {
        setSaveError("");
        setSaveSuccess("");

        const sectionsToSave = selectedSectionObjects.map((section) => ({
            name: section.name,
            isBlank: section.isBlank,
            isDefault: section.isDefault,
            activities: (activities[section.id] || []).map((activity) => ({
                name: activity.name,
                isBlank: activity.isBlank,
            })),
        }));

        if (sectionsToSave.length === 0) {
            setSaveError("Choose at least one section before saving.");
            return;
        }

        setIsSaving(true);

        try {
            const response = await fetch(
                editingPlannerId
                    ? `/api/planner/${editingPlannerId}`
                    : "/api/planner",
                {
                method: editingPlannerId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, sections: sectionsToSave }),
                }
            );
            const data = await response.json();

            if (!response.ok) {
                setSaveError(data.message || "Unable to save the planner.");
                return;
            }

            setEditingPlannerId(data.plannerId);
            setPlannerTitle(title);
            setSaveSuccess(
                editingPlannerId
                    ? "Planner updated successfully."
                    : "Planner saved successfully."
            );
        } catch {
            setSaveError("Unable to reach the server. Please try again.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <main
            className={`planner-preview-main ${paperSize === "A4"
                ? "planner-a4"
                : "planner-a3"
                } min-h-screen overflow-x-auto bg-gray-100 py-8`}
        >

            {/* =========================
                CONTROLS
            ========================== */}

            <div className="no-print mx-auto mb-6 flex max-w-262.5 items-start justify-between px-4">

                <Button
                    variant="outline"
                    onClick={() =>
                        router.back()
                    }
                >
                    Back
                </Button>

                <div className="flex flex-col items-end gap-2">

                    <div className="flex items-center gap-2">
                        <Input
                            aria-label="Planner title"
                            className="w-56 bg-white"
                            disabled={isSaving}
                            placeholder="Planner title"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                        />

                        <Button disabled={isSaving} onClick={handleSave}>
                            {isSaving ? "Saving..." : "Save Planner"}
                        </Button>
                    </div>

                    {saveError && (
                        <p className="max-w-80 text-right text-sm text-red-600">
                            {saveError}
                        </p>
                    )}

                    {saveSuccess && (
                        <p className="text-sm text-green-700">{saveSuccess}</p>
                    )}

                    <Button
                        onClick={() =>
                            window.print()
                        }
                    >
                        Print / Save PDF
                    </Button>

                    <select
                        value={paperSize}
                        onChange={(event) =>
                            setPaperSize(
                                event.target
                                    .value as
                                | "A4"
                                | "A3"
                            )
                        }
                        className="rounded border border-black/20 bg-white px-3 py-2 text-sm"
                    >
                        <option value="A4">
                            A4 Landscape
                        </option>

                        <option value="A3">
                            A3 Landscape
                        </option>
                    </select>

                </div>

            </div>

            {/* =========================
                PRINT SHEET
            ========================== */}

            <div className="planner-sheet rounded-xl shadow">

                {/* =========================
                    HEADER
                ========================== */}

                <div className="flex items-start justify-between gap-4">

                    <div className="shrink-0 text-sm">

                        <p>
                            <strong>
                                Name:
                            </strong>{" "}
                            ___________________
                        </p>

                        <p className="mt-3 flex items-center gap-2">

                            <strong>
                                Month:
                            </strong>

                            <select
                                className="no-print rounded border border-black/20 bg-white px-1 py-0.5 text-sm outline-none"
                                value={
                                    selectedMonth
                                }
                                onChange={(event) =>
                                    setSelectedMonth(
                                        Number(
                                            event
                                                .target
                                                .value
                                        )
                                    )
                                }
                            >
                                {MONTH_NAMES.map(
                                    (
                                        name,
                                        index
                                    ) => (
                                        <option
                                            key={
                                                name
                                            }
                                            value={
                                                index
                                            }
                                        >
                                            {name}
                                        </option>
                                    )
                                )}
                            </select>

                            <span className="hidden print:inline">
                                {monthName}
                            </span>

                        </p>

                    </div>

                    <div className="min-w-0 flex-1 text-center">

                        <h1 className="text-2xl font-bold tracking-tight">
                            My 30 Day Journey
                        </h1>

                        <p className="mt-1 text-xs text-gray-500">
                            Little steps today, better me tomorrow Insha&apos;Allah.
                        </p>

                    </div>

                    <div className="shrink-0 text-sm">

                        <p className="font-semibold">
                            Focus This Month
                        </p>

                        <div className="mt-8 w-36 border-b border-black" />

                    </div>

                </div>

                {/* =========================
                    MAIN HABIT TRACKER
                ========================== */}

                <div className="planner-tracker-wrapper mt-4">

                    <table
                        className="planner-table-main border-collapse border border-black text-center text-[10px]"
                        style={{
                            "--activity-row-height":
                                `${activityRowHeight}mm`,
                        } as React.CSSProperties}
                    >

                        <colgroup>

                            <col className="planner-section-col" />

                            <col className="planner-activity-col" />

                            <DayColumns
                                dayCount={
                                    dayCount
                                }
                            />

                        </colgroup>

                        <thead>

                            <tr className="planner-header-row">

                                <th className="border border-black p-1 font-semibold whitespace-nowrap">
                                    Section
                                </th>

                                <th className="border border-black p-1 font-semibold whitespace-nowrap">
                                    Activity
                                </th>

                                <DayHeaderCells
                                    dayCount={
                                        dayCount
                                    }
                                />

                            </tr>

                        </thead>

                        <tbody>

                            {selectedSectionObjects.map(
                                (section) => {
                                    const sectionActivities =
                                        activities[section.id] || [];

                                    if (
                                        sectionActivities.length === 0
                                    ) {
                                        return null;
                                    }

                                    return sectionActivities.map(
                                        (
                                            activity,
                                            activityIndex
                                        ) => (
                                            <tr
                                                key={activity.id}
                                                className="planner-habit-row"
                                            >

                                                {activityIndex === 0 && (
                                                    <td
                                                        rowSpan={
                                                            sectionActivities.length
                                                        }
                                                        className="border border-black p-2 text-[13px] font-bold align-middle whitespace-nowrap"
                                                    >
                                                        {section.isBlank ? (
                                                            <BlankLine
                                                                minWidth="8rem"
                                                            />
                                                        ) : (
                                                            section.name
                                                        )}
                                                    </td>
                                                )}

                                                <td className="border border-black p-1 text-[14px] text-center align-middle whitespace-nowrap">
                                                    {activity.isBlank ? (
                                                        <BlankLine
                                                            minWidth="7rem"
                                                        />
                                                    ) : (
                                                        activity.name
                                                    )}
                                                </td>

                                                <DayCheckboxCells
                                                    dayCount={dayCount}
                                                />

                                            </tr>
                                        )
                                    );
                                }
                            )}

                        </tbody>

                    </table>

                </div>

                {/* =========================
                    FOOTER
                ========================== */}

                <div className="planner-footer mt-6">

                    <table className="planner-table border-collapse border border-black text-center text-[14px]">

                        <colgroup>

                            <col style={{ width: "30%" }} />

                            <col style={{ width: "15%" }} />

                            <col style={{ width: "40%" }} />

                            <col style={{ width: "15%" }} />

                        </colgroup>

                        <thead>

                            <tr>

                                <th className="border border-black p-1 font-semibold">
                                    Weekly Rewards
                                </th>

                                <th className="border border-black p-1 font-semibold">
                                    Month Reward
                                </th>

                                <th className="border border-black p-1 font-semibold">
                                    Daily Stars
                                </th>

                                <th className="border border-black p-1 font-semibold">
                                    Signatures
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr>

                                <td className="border border-black align-top p-1 relative">
                                    <WeeklyRewardGrid />
                                </td>

                                <td className="border border-black align-top p-2">
                                </td>

                                <td className="border border-black p-0 align-middle h-28">
                                    <DailyStarsGrid
                                        dayCount={
                                            dayCount
                                        }
                                    />
                                </td>

                                <td className="border border-black p-0 relative">

                                    <div className="absolute inset-0 grid grid-rows-2">

                                        <div className="flex items-end justify-center border-b border-black p-1">

                                            <p className="text-[10px] font-medium leading-none">
                                                Parent Signature
                                            </p>

                                        </div>

                                        <div className="flex items-end justify-center p-1">

                                            <p className="text-[10px] font-medium leading-none">
                                                Child Signature
                                            </p>

                                        </div>

                                    </div>

                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

                <p className="mt-4 text-center text-[10px] text-gray-500">
                    I am trying my best for Allah
                </p>

            </div>

        </main>
    );
}
