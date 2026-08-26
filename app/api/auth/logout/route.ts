import { NextResponse } from "next/server";

// POST /api/auth/logout removes the HTTP-only authentication cookie.
export async function POST(request: Request) {
    // A 303 tells the browser to load the home page with a GET request after logout.
    const response = NextResponse.redirect(
        new URL("/", request.url),
        { status: 303 }
    );

    response.cookies.set("auth_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });

    return response;
}
