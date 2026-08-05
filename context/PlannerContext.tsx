"use client";

import {
    createContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";

/*
==========================================================
Shared Planner State
----------------------------------------------------------
This file stores data that multiple pages need.

Sections Page
        ↓
Configure Page
        ↓
Preview Page

Instead of each page having its own copy,
they all read the same data from here.
==========================================================
*/

interface PlannerContextType {
    // Selected sections chosen by the user.
    selectedSections: string[];

    // Function to update selected sections.
    setSelectedSections: Dispatch<SetStateAction<string[]>>;

    // Activities for every section.
    //
    // Example:
    // {
    //   "Learn & Read": ["Quran Reading", "Homework"],
    //   "Exercise": ["Running"]
    // }
    activities: {
        [key: string]: string[];
    };

    // Function to update activities.
    setActivities: Dispatch<
        SetStateAction<{
            [key: string]: string[];
        }>
    >;
}

// Create the Context.
export const PlannerContext =
    createContext<PlannerContextType | null>(null);

// Props for Provider.
interface PlannerProviderProps {
    children: ReactNode;
}

// Provider Component.
export function PlannerProvider({
    children,
}: PlannerProviderProps) {

    // Selected sections.
    const [selectedSections, setSelectedSections] =
        useState<string[]>([]);

    // Activities of every section.
    const [activities, setActivities] = useState<{
        [key: string]: string[];
    }>({});

    return (
        <PlannerContext.Provider
            value={{
                selectedSections,
                setSelectedSections,
                activities,
                setActivities,
            }}
        >
            {children}
        </PlannerContext.Provider>
    );
}