"use client";

import {
    createContext,
    useCallback,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";

/*
Shared Planner State

Sections Page
↓
Configure Page
↓
Preview Page
*/

export interface PlannerSection {
    id: string;
    name: string;
    isBlank: boolean;
    isDefault: boolean;
}

export interface PlannerActivity {
    id: string;
    name: string;
    isBlank: boolean;
}

interface PlannerContextType {
    // Database ID of the planner currently being edited. Null means a new planner.
    editingPlannerId: number | null;
    setEditingPlannerId: Dispatch<SetStateAction<number | null>>;

    // The title is kept while moving between the planner's client-side steps.
    plannerTitle: string;
    setPlannerTitle: Dispatch<SetStateAction<string>>;

    // All available sections.
    availableSections: PlannerSection[];

    // Update available sections.
    setAvailableSections: Dispatch<
        SetStateAction<PlannerSection[]>
    >;

    // IDs of the selected sections.
    selectedSections: string[];

    // Update selected section IDs.
    setSelectedSections: Dispatch<
        SetStateAction<string[]>
    >;

    // Activities grouped by section ID.
    activities: Record<string, PlannerActivity[]>;

    // Update activities.
    setActivities: Dispatch<
        SetStateAction<Record<string, PlannerActivity[]>>
    >;

    // Clears old planner data before starting a completely new planner.
    resetPlanner: () => void;
}

// Create Context.
export const PlannerContext =
    createContext<PlannerContextType | null>(null);

interface PlannerProviderProps {
    children: ReactNode;
}

export function PlannerProvider({
    children,
}: PlannerProviderProps) {

    // Available sections.
    const [availableSections, setAvailableSections] =
        useState<PlannerSection[]>([]);

    // Selected section IDs.
    const [selectedSections, setSelectedSections] =
        useState<string[]>([]);

    // Activities grouped by section ID.
    const [activities, setActivities] =
        useState<Record<string, PlannerActivity[]>>({});

    const [editingPlannerId, setEditingPlannerId] =
        useState<number | null>(null);

    const [plannerTitle, setPlannerTitle] = useState("");

    const resetPlanner = useCallback(() => {
        setAvailableSections([]);
        setSelectedSections([]);
        setActivities({});
        setEditingPlannerId(null);
        setPlannerTitle("");
    }, []);

    return (
        <PlannerContext.Provider
            value={{
                editingPlannerId,
                setEditingPlannerId,

                plannerTitle,
                setPlannerTitle,

                availableSections,
                setAvailableSections,

                selectedSections,
                setSelectedSections,

                activities,
                setActivities,

                resetPlanner,
            }}
        >
            {children}
        </PlannerContext.Provider>
    );
}
