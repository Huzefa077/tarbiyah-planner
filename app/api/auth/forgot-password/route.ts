import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { ILike } from "typeorm";
import { z } from "zod";

import { User } from "@/database/entities/User";
import { connectDatabase } from "@/lib/database";
import { sendPasswordResetEmail } from "@/lib/email";

const forgotPasswordSchema = z.object({
    email: z.string().trim().email("Please enter a valid email address."),
});

// Keep this response identical for unknown, Google-only, and password accounts.
const successMessage = "If an account exists for this email address, a reset link will be sent shortly.";

export async function POST(request: Request) {
    try {
        const result = forgotPasswordSchema.safeParse(await request.json());

        if (!result.success) {
            return NextResponse.json(
                { message: result.error.issues[0].message },
                { status: 400 }
            );
        }

        const database = await connectDatabase();
        const userRepository = database.getRepository(User);
        const user = await userRepository.findOne({
            where: { email: ILike(result.data.email) },
        });

        // Google-only users have no app password to reset.
        if (
            !user ||
            !user.password ||
            (!user.emailVerifiedAt && user.emailVerificationTokenHash)
        ) {
            return NextResponse.json({ message: successMessage });
        }

        const now = new Date();
        const requestedRecently =
            user.passwordResetRequestedAt &&
            now.getTime() - user.passwordResetRequestedAt.getTime() < 60_000;

        // A short per-account limit prevents repeated reset-email requests.
        if (requestedRecently) {
            return NextResponse.json({ message: successMessage });
        }

        const rawToken = randomBytes(32).toString("hex");
        user.passwordResetTokenHash = createHash("sha256")
            .update(rawToken)
            .digest("hex");
        user.passwordResetExpiresAt = new Date(now.getTime() + 15 * 60 * 1000);
        user.passwordResetRequestedAt = now;
        await userRepository.save(user);

        const resetUrl = new URL("/reset-password", request.url);
        resetUrl.searchParams.set("token", rawToken);

        try {
            await sendPasswordResetEmail({
                recipient: user.email,
                resetUrl: resetUrl.toString(),
            });
        } catch (emailError) {
            // Do not leave a usable token behind when Gmail could not deliver the link.
            user.passwordResetTokenHash = null;
            user.passwordResetExpiresAt = null;
            await userRepository.save(user);
            console.error("Password-reset email failed:", emailError);
            return NextResponse.json(
                { message: "Password reset email is temporarily unavailable. Please try again." },
                { status: 503 }
            );
        }

        return NextResponse.json({ message: successMessage });
    } catch (error) {
        console.error("Forgot-password error:", error);
        return NextResponse.json(
            { message: "Unable to start password reset. Please try again." },
            { status: 500 }
        );
    }
}
