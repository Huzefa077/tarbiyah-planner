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

const sectionSchema = z.object({
  name: z.string().trim().max(100),
  isBlank: z.boolean(),
  isDefault: z.boolean(),
  activities: z.array(activitySchema).max(15),
});

const plannerSchema = z.object({
  title: z.string().trim().min(1, "Please enter a planner title.").max(100),
  sections: z.array(sectionSchema).min(1, "Add at least one section.").max(20),
});

// POST /api/planner creates one planner and all of its sections and activities.
export async function POST(request: Request) {
  try {
    // A request cannot choose its own user: this verifies the HTTP-only cookie.
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please log in before saving a planner." },
        { status: 401 }
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

    // A transaction rolls everything back if one database step fails.
    const planner = await database.transaction(async (manager) => {
      const savedPlanner = await manager.save(
        manager.create(Planner, { title: result.data.title, user })
      );

      for (const sectionData of result.data.sections) {
        const savedSection = await manager.save(
          manager.create(Section, {
            name: sectionData.name,
            isBlank: sectionData.isBlank,
            isDefault: sectionData.isDefault,
            planner: savedPlanner,
          })
        );

        if (sectionData.activities.length > 0) {
          await manager.save(
            Activity,
            sectionData.activities.map((activity) =>
              manager.create(Activity, {
                name: activity.name,
                isBlank: activity.isBlank,
                section: savedSection,
              })
            )
          );
        }
      }

      return savedPlanner;
    });

    return NextResponse.json(
      { success: true, message: "Planner saved.", plannerId: planner.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save planner error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to save the planner. Please try again." },
      { status: 500 }
    );
  }
}
