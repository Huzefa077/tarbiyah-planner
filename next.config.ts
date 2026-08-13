import type { NextConfig } from "next";

/*
==========================================================
NEXT.JS CONFIGURATION

TypeORM, pg, and bcrypt are Node.js/server-side packages.

We tell Next.js not to bundle these packages into the
server build. Instead, Node.js loads them normally at
runtime.

This is especially useful for our API Route Handlers.

Vercel's file tracer separately decides which node_modules
files get shipped into the deployed function. TypeORM loads
"pg" via a dynamic require() buried inside its driver code,
which that tracer can miss — silently dropping pg from the
deployment even though serverExternalPackages is correct.
outputFileTracingIncludes forces pg to always be included.
==========================================================
*/

const nextConfig: NextConfig = {
    serverExternalPackages: [
        "typeorm",
        "pg",
        "bcrypt",
    ],

    outputFileTracingIncludes: {
        "/**": [
            "./node_modules/pg/**/*",
            "./node_modules/pg-*/**/*",
        ],
    },
};

export default nextConfig;