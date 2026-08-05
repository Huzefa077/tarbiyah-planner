"use client";

import { useContext } from "react";
import { PlannerContext } from "@/context/PlannerContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PreviewPage() {
    const router = useRouter();

    const planner = useContext(PlannerContext);

    if (!planner) {
        throw new Error("PlannerContext not found");
    }

    const {
        selectedSections,
        activities,
    } = planner;

    return (
        <main className="min-h-screen bg-gray-100 py-10">

            <div className="mx-auto max-w-7xl rounded-xl bg-white p-10 shadow">

                {/* ===============================HEADER================================ */}

                <div className="flex justify-between items-start">

                    <div>

                        <p>
                            <strong>Name:</strong> ___________________
                        </p>

                        <p className="mt-3">
                            <strong>Start Date:</strong> _______________
                        </p>

                    </div>

                    <div className="text-center">

                        <h1 className="text-3xl font-bold">
                            My 30 Day Journey
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Little steps today, better me tomorrow Insha'Allah.
                        </p>

                    </div>

                    <div>

                        <p className="font-semibold">
                            Focus This Month
                        </p>

                        <div className="border-b w-44 mt-8"></div>

                    </div>

                </div>

                {/* ======================= 30 Day Planner Table ======================= */}

                <div className="mt-10 overflow-x-auto">

                    <table className="border-collapse border border-black w-full text-center text-[11px]">

                        {/* ---------------- Header ---------------- */}

                        <thead>

                            <tr>

                                <th className="border border-black p-2 w-40">
                                    Section
                                </th>

                                <th className="border border-black p-2 w-64">
                                    Activity
                                </th>

                                {Array.from({ length: 30 }, (_, day) => (

                                    <th
                                        key={day}
                                        className="border border-black w-8 h-8"
                                    >
                                        {day + 1}
                                    </th>

                                ))}

                            </tr>

                        </thead>

                        <tbody>

                            {/* ---------------- PRAYER ---------------- */}

                            {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map(
                                (prayer, prayerIndex) => (

                                    <tr key={prayer}>

                                        {/* Show PRAY only once */}
                                        {prayerIndex === 0 && (

                                            <td
                                                rowSpan={5}
                                                className="border border-black font-bold align-top p-3"
                                            >
                                                PRAY
                                            </td>

                                        )}

                                        {/* Prayer Activity */}
                                        <td className="border border-black p-2">
                                            {prayer}
                                        </td>

                                        {/* 30 Days */}
                                        {Array.from({ length: 30 }, (_, day) => (

                                            <td
                                                key={day}
                                                className="border border-black text-center"
                                            >
                                                <input
                                                    type="checkbox"
                                                />
                                            </td>

                                        ))}

                                    </tr>

                                )
                            )}

                            {/* ---------------- USER SECTIONS ---------------- */}

                            {selectedSections.map((section) => {

                                const sectionActivities =
                                    activities[section] || [];

                                // Skip sections without activities
                                if (sectionActivities.length === 0) return null;

                                return sectionActivities.map(

                                    (activity: string, activityIndex: number) => (

                                        <tr
                                            key={`${section}-${activityIndex}`}
                                        >

                                            {/* Show section name only once */}
                                            {activityIndex === 0 && (

                                                <td
                                                    rowSpan={sectionActivities.length}
                                                    className="border border-black font-bold align-top p-3"
                                                >
                                                    {section}
                                                </td>

                                            )}

                                            {/* Activity */}
                                            <td className="border border-black p-2">

                                                {activity}

                                            </td>

                                            {/* 30 Days */}
                                            {Array.from({ length: 30 }, (_, day) => (

                                                <td
                                                    key={day}
                                                    className="border border-black text-center"
                                                >
                                                    <input
                                                        type="checkbox"
                                                    />
                                                </td>

                                            ))}

                                        </tr>

                                    )

                                );

                            })}

                        </tbody>

                    </table>

                </div>

                {/* ======================================================
BOTTOM SUMMARY
====================================================== */}

                <div className="mt-10 overflow-x-auto">

                    <table className="w-full border-collapse border border-black text-center">

                        <thead>

                            <tr>

                                <th className="border border-black p-2 w-40">
                                    Week 1 Reward
                                </th>

                                <th className="border border-black p-2 w-40">
                                    Week 2 Reward
                                </th>

                                <th className="border border-black p-2 w-40">
                                    Week 3 Reward
                                </th>

                                <th className="border border-black p-2 w-40">
                                    Week 4 Reward
                                </th>

                                <th className="border border-black p-2 w-64">
                                    Month Reward
                                </th>

                                <th className="border border-black p-2">
                                    Daily Stars
                                </th>

                                <th className="border border-black p-2 w-44">
                                    Parent Sign
                                </th>

                                <th className="border border-black p-2 w-44">
                                    Child Sign
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr>

                                {/* Week Rewards */}

                                <td className="border border-black h-24 align-top p-3">
                                    ___________________
                                </td>

                                <td className="border border-black h-24 align-top p-3">
                                    ___________________
                                </td>

                                <td className="border border-black h-24 align-top p-3">
                                    ___________________
                                </td>

                                <td className="border border-black h-24 align-top p-3">
                                    ___________________
                                </td>

                                {/* Month Reward */}

                                <td className="border border-black h-24 align-top p-3">
                                    ________________________________
                                </td>

                                {/* Daily Stars */}

                                <td className="border border-black p-2">

                                    <div className="grid grid-cols-5 gap-2">

                                        {Array.from({ length: 30 }, (_, index) => (

                                            <div
                                                key={index}
                                                className="flex flex-col items-center"
                                            >

                                                <div className="text-[10px]">
                                                    {index + 1}
                                                </div>

                                                <div className="border border-black rounded-full w-6 h-6"></div>

                                            </div>

                                        ))}

                                    </div>

                                </td>

                                {/* Parent */}

                                <td className="border border-black align-bottom p-3">

                                    <div className="mt-16 border-b border-black"></div>

                                </td>

                                {/* Child */}

                                <td className="border border-black align-bottom p-3">

                                    <div className="mt-16 border-b border-black"></div>

                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        </main>
    );
}