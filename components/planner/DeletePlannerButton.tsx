"use client";

// One deletion control shared by dashboard cards and saved planner screens.
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type DeletePlannerButtonProps = {
  plannerId: number;
  plannerTitle: string;
  label?: string;
  className?: string;
};

export function DeletePlannerButton({
  plannerId,
  plannerTitle,
  label = "Delete planner",
  className,
}: DeletePlannerButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function deletePlanner() {
    const confirmed = window.confirm(
      `Delete "${plannerTitle}" permanently? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/planner/${plannerId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to delete the planner.");
        return;
      }

      // Replace prevents Back from returning to a planner that no longer exists.
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className={className}>
      <Button
        type="button"
        variant="outline"
        className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={deletePlanner}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : label}
      </Button>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
