import { NextResponse } from "next/server";
import { z } from "zod";

import { Feedback } from "@/database/entities/Feedback";
import { getCurrentUser } from "@/lib/auth";
import { connectDatabase } from "@/lib/database";

// This is the shape of feedback that the server accepts from the browser.
const feedbackSchema = z.object({
    category: z.enum(["idea", "feedback", "problem"]),
    message: z
        .string()
        .trim()
        .min(10, "Please write at least 10 characters.")
        .max(1200, "Feedback must be 1200 characters or fewer."),
    contactEmail: z
        .string()
        .trim()
        .email("Please enter a valid email address.")
        .optional()
        .or(z.literal("")),
});

// POST /api/feedback saves one product idea, recommendation, or problem report.
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = feedbackSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { message: result.error.issues[0].message },
                { status: 400 }
            );
        }

        const currentUser = await getCurrentUser();
        const database = await connectDatabase();
        const feedbackRepository = database.getRepository(Feedback);

        const feedback = feedbackRepository.create({
            category: result.data.category,
            message: result.data.message,
            // Prefer the visitor's entered email; otherwise use their signed-in email.
            contactEmail: result.data.contactEmail || currentUser?.email || null,
            userId: currentUser?.id || null,
        });

        await feedbackRepository.save(feedback);

        return NextResponse.json(
            { message: "Thank you for sharing your feedback." },
            { status: 201 }
        );
    } catch (error) {
        console.error("Unable to save feedback:", error);

        return NextResponse.json(
            { message: "Unable to send feedback. Please try again." },
            { status: 500 }
        );
    }
}
