import type { NextConfig } from "next";

/*
==========================================================
NEXT.JS CONFIGURATION

TypeORM, pg, and bcrypt are Node.js/server-side packages.

We tell Next.js not to bundle these packages into the
server build. Instead, Node.js loads them normally at
runtime.

This is especially useful for our API Route Handlers.
==========================================================
*/

const nextConfig: NextConfig = {
    serverExternalPackages: [
        "typeorm",
        "pg",
        "bcrypt",
    ],
};

export default nextConfig;