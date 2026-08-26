import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

import { User } from "@/database/entities/User";
import { connectDatabase } from "@/lib/database";

const verifyEmailSchema = z.object({
    token: z.string().length(64, "This verification link is invalid."),
});

// POST /api/auth/verify-email verifies a one-time token from the registration email.
export async function POST(request: Request) {
    try {
        const result = verifyEmailSchema.safeParse(await request.json());

        if (!result.success) {
            return NextResponse.json(
                { message: result.error.issues[0].message },
                { status: 400 }
            );
        }

        const tokenHash = createHash("sha256")
            .update(result.data.token)
            .digest("hex");
        const database = await connectDatabase();
        const userRepository = database.getRepository(User);
        const user = await userRepository.findOne({
            where: { emailVerificationTokenHash: tokenHash },
        });

        if (!user || !user.emailVerificationExpiresAt || user.emailVerificationExpiresAt < new Date()) {
            return NextResponse.json(
                { message: "This verification link is invalid or has expired." },
                { status: 400 }
            );
        }

        user.emailVerifiedAt = new Date();
        user.emailVerificationTokenHash = null;
        user.emailVerificationExpiresAt = null;
        await userRepository.save(user);

        return NextResponse.json({
            message: "Email verified successfully. You can now sign in.",
        });
    } catch (error) {
        console.error("Email-verification error:", error);
        return NextResponse.json(
            { message: "Unable to verify email. Please try again." },
            { status: 500 }
        );
    }
}
