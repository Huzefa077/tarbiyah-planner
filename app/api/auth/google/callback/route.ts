import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ILike } from "typeorm";

import { User } from "@/database/entities/User";
import { connectDatabase } from "@/lib/database";

const STATE_COOKIE_NAME = "google_oauth_state";

function redirectToLogin(request: Request) {
    const response = NextResponse.redirect(
        new URL("/login", request.url)
    );

    // The state value is single-use, whether Google sign-in succeeds or fails.
    response.cookies.set(STATE_COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });

    return response;
}

// GET /api/auth/google/callback receives Google's one-time authorization code.
export async function GET(request: Request) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const cookieStore = await cookies();
    const savedState = cookieStore.get(STATE_COOKIE_NAME)?.value;

    // Reject a callback that was not started by this browser.
    if (!code || !state || state !== savedState) {
        return redirectToLogin(request);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const jwtSecret = process.env.JWT_SECRET;

    if (!clientId || !clientSecret || !jwtSecret) {
        console.error("Google or JWT authentication environment variables are missing.");
        return redirectToLogin(request);
    }

    try {
        const callbackUrl = new URL(
            "/api/auth/google/callback",
            request.url
        ).toString();

        // Exchange Google's one-time code for a signed ID token.
        const tokenResponse = await fetch(
            "https://oauth2.googleapis.com/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    code,
                    client_id: clientId,
                    client_secret: clientSecret,
                    redirect_uri: callbackUrl,
                    grant_type: "authorization_code",
                }),
            }
        );

        const tokenData = (await tokenResponse.json()) as {
            id_token?: string;
        };

        if (!tokenResponse.ok || !tokenData.id_token) {
            return redirectToLogin(request);
        }

        // google-auth-library verifies Google's signature and this app's client ID.
        const googleClient = new OAuth2Client(clientId);
        const ticket = await googleClient.verifyIdToken({
            idToken: tokenData.id_token,
            audience: clientId,
        });
        const profile = ticket.getPayload();

        if (!profile?.sub || !profile.email || !profile.email_verified) {
            return redirectToLogin(request);
        }

        const email = profile.email.toLowerCase();
        const database = await connectDatabase();
        const userRepository = database.getRepository(User);

        // Prefer Google's permanent ID. Email is only used to link an older password account.
        let user = await userRepository.findOne({
            where: { googleId: profile.sub },
        });

        if (!user) {
            user = await userRepository.findOne({
                where: { email: ILike(email) },
            });

            if (user) {
                // A verified matching email proves this Google account owns the existing account.
                user.googleId = profile.sub;
            } else {
                user = userRepository.create({
                    fullName: profile.name?.trim() || email.split("@")[0],
                    email,
                    password: null,
                    googleId: profile.sub,
                    // Google has already verified this email in the ID token we checked above.
                    emailVerifiedAt: new Date(),
                });
            }

            user = await userRepository.save(user);
        }

        // A verified matching Google account can also verify an older password account.
        if (!user.emailVerifiedAt) {
            user.emailVerifiedAt = new Date();
            user.emailVerificationTokenHash = null;
            user.emailVerificationExpiresAt = null;
            user = await userRepository.save(user);
        }

        // Google-authenticated users receive the same 7-day app session as password users.
        const token = jwt.sign(
            { userId: user.id },
            jwtSecret,
            { expiresIn: "7d" }
        );

        const response = NextResponse.redirect(
            new URL("/dashboard", request.url)
        );

        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        response.cookies.set(STATE_COOKIE_NAME, "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });

        return response;
    } catch (error) {
        // Keep detailed provider errors on the server; visitors receive a safe generic result.
        console.error("Google sign-in failed:", error);
        return redirectToLogin(request);
    }
}
