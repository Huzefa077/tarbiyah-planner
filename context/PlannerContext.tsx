"use client";

import {
    createContext,
    useCallback,
    useEffect,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";

// sessionStorage belongs to one browser tab and is never sent to PostgreSQL.
const DRAFT_STORAGE_KEY = "tarbiyah-planner-draft";

/*
Shared Planner State

Sections Page
↓
Activity Page
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

    /*
    React state disappears on a page refresh. sessionStorage lets an unfinished
    planner survive that refresh without becoming a saved database planner.
    We wait until the initial read finishes before writing, so an empty first
    render cannot overwrite an existing draft.
    */
    const [isDraftLoaded, setIsDraftLoaded] = useState(false);

    /*
    sessionStorage is an external browser store. This one-time effect must put
    its saved draft into React state after the page mounts, so the lint rule is
    disabled only for this deliberate hydration step.
    */
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        try {
            const savedDraft = sessionStorage.getItem(DRAFT_STORAGE_KEY);

            if (savedDraft) {
                const draft = JSON.parse(savedDraft);

                setAvailableSections(draft.availableSections || []);
                setSelectedSections(draft.selectedSections || []);
                setActivities(draft.activities || {});
                setEditingPlannerId(draft.editingPlannerId ?? null);
                setPlannerTitle(draft.plannerTitle || "");
            }
        } catch {
            // A broken old draft is ignored; the parent can start a fresh one.
        } finally {
            setIsDraftLoaded(true);
        }
    }, []);
    /* eslint-enable react-hooks/set-state-in-effect */

    useEffect(() => {
        if (!isDraftLoaded) {
            return;
        }

        const draft = {
            availableSections,
            selectedSections,
            activities,
            editingPlannerId,
            plannerTitle,
        };

        sessionStorage.setItem(
            DRAFT_STORAGE_KEY,
            JSON.stringify(draft)
        );
    }, [
        isDraftLoaded,
        availableSections,
        selectedSections,
        activities,
        editingPlannerId,
        plannerTitle,
    ]);

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
