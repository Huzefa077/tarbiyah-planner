import { NextResponse } from "next/server";
import { z } from "zod";

import { Activity } from "@/database/entities/Activity";
import { Planner } from "@/database/entities/Planner";
import { Section } from "@/database/entities/Section";
import { getCurrentUser } from "@/lib/auth";
import { connectDatabase } from "@/lib/database";

const activitySchema = z.object({
  name: z.string().trim().max(100),
  isBlank: z.boolean(),
});

const plannerSchema = z.object({
  title: z.string().trim().min(1, "Please enter a planner title.").max(100),
  sections: z.array(z.object({
    name: z.string().trim().max(100),
    isBlank: z.boolean(),
    isDefault: z.boolean(),
    activities: z.array(activitySchema).max(15),
  })).min(1, "Add at least one section.").max(20),
});

// PUT /api/planner/:id replaces the saved sections/activities for one of the user's planners.
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;
    const plannerId = Number(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please log in before updating a planner." },
        { status: 401 }
      );
    }

    if (!Number.isInteger(plannerId) || plannerId < 1) {
      return NextResponse.json(
        { success: false, message: "Planner not found." },
        { status: 404 }
      );
    }

    const result = plannerSchema.safeParse(await request.json());

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const database = await connectDatabase();
    const existingPlanner = await database.getRepository(Planner).findOne({
      where: { id: plannerId, user: { id: user.id } },
    });

    // Returning 404 for another user's ID prevents users learning whether it exists.
    if (!existingPlanner) {
      return NextResponse.json(
        { success: false, message: "Planner not found." },
        { status: 404 }
      );
    }

    await database.transaction(async (manager) => {
      await manager.update(Planner, plannerId, { title: result.data.title });

      // Removing Sections also removes their Activities through the database cascade.
      await manager
        .createQueryBuilder()
        .delete()
        .from(Section)
        .where('"plannerId" = :plannerId', { plannerId })
        .execute();

      for (const sectionData of result.data.sections) {
        const sectionResult = await manager.insert(Section, {
          name: sectionData.name,
          isBlank: sectionData.isBlank,
          isDefault: sectionData.isDefault,
          planner: { id: plannerId },
        });

        const newSectionId = Number(sectionResult.identifiers[0].id);

        if (sectionData.activities.length > 0) {
          await manager.insert(
            Activity,
            sectionData.activities.map((activity) => ({
              name: activity.name,
              isBlank: activity.isBlank,
              section: { id: newSectionId },
            }))
          );
        }
      }
    });

    return NextResponse.json(
      { success: true, message: "Planner updated.", plannerId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update planner error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to update the planner. Please try again." },
      { status: 500 }
    );
  }
}

// DELETE /api/planner/:id removes one planner owned by the logged-in user.
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;
    const plannerId = Number(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please log in before deleting a planner." },
        { status: 401 }
      );
    }

    if (!Number.isInteger(plannerId) || plannerId < 1) {
      return NextResponse.json(
        { success: false, message: "Planner not found." },
        { status: 404 }
      );
    }

    /*
    This query checks both the planner ID and owner ID.
    A person cannot delete another user's planner merely by changing the URL.
    */
    const database = await connectDatabase();
    const planner = await database.getRepository(Planner).findOne({
      where: { id: plannerId, user: { id: user.id } },
    });

    if (!planner) {
      return NextResponse.json(
        { success: false, message: "Planner not found." },
        { status: 404 }
      );
    }

    /*
    PostgreSQL's foreign-key cascade removes this planner's Sections and
    Activities automatically. We delete the parent Planner once.
    */
    await database.getRepository(Planner).delete(plannerId);

    return NextResponse.json(
      { success: true, message: "Planner deleted." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete planner error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to delete the planner. Please try again." },
      { status: 500 }
    );
  }
}
