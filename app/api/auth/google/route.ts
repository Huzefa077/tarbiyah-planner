import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

const STATE_COOKIE_NAME = "google_oauth_state";

// GET /api/auth/google starts Google OAuth by redirecting the browser to Google.
export async function GET(request: Request) {
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
        return NextResponse.json(
            { message: "Google sign-in is not configured." },
            { status: 500 }
        );
    }

    // This random value lets the callback prove it belongs to this browser.
    const state = randomUUID();
    const callbackUrl = new URL(
        "/api/auth/google/callback",
        request.url
    ).toString();

    const googleUrl = new URL(
        "https://accounts.google.com/o/oauth2/v2/auth"
    );

    googleUrl.searchParams.set("client_id", clientId);
    googleUrl.searchParams.set("redirect_uri", callbackUrl);
    googleUrl.searchParams.set("response_type", "code");
    googleUrl.searchParams.set("scope", "openid email profile");
    googleUrl.searchParams.set("state", state);
    googleUrl.searchParams.set("prompt", "select_account");

    const response = NextResponse.redirect(googleUrl);

    response.cookies.set(STATE_COOKIE_NAME, state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 10,
    });

    return response;
}
