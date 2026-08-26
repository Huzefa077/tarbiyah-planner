import { createHash } from "crypto";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { z } from "zod";

import { User } from "@/database/entities/User";
import { connectDatabase } from "@/lib/database";

const resetPasswordSchema = z.object({
    token: z.string().length(64, "This reset link is invalid."),
    password: z.string().min(8, "Password must contain at least 8 characters."),
});

export async function POST(request: Request) {
    try {
        const result = resetPasswordSchema.safeParse(await request.json());

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
            where: { passwordResetTokenHash: tokenHash },
        });

        if (!user || !user.passwordResetExpiresAt || user.passwordResetExpiresAt < new Date()) {
            return NextResponse.json(
                { message: "This reset link is invalid or has expired. Request a new one." },
                { status: 400 }
            );
        }

        user.password = await bcrypt.hash(result.data.password, 10);
        user.passwordResetTokenHash = null;
        user.passwordResetExpiresAt = null;
        user.passwordResetRequestedAt = null;

        // JWT issued-at times use whole seconds, so use the same precision here.
        user.passwordChangedAt = new Date(Math.floor(Date.now() / 1000) * 1000);
        await userRepository.save(user);

        const response = NextResponse.json({
            message: "Password reset successfully. You can now sign in.",
        });

        // Clear the current browser's session; lib/auth also rejects older sessions everywhere.
        response.cookies.set("auth_token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });

        return response;
    } catch (error) {
        console.error("Reset-password error:", error);
        return NextResponse.json(
            { message: "Unable to reset password. Please try again." },
            { status: 500 }
        );
    }
}
