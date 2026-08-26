import { database } from "@/config/database";

/*
==========================================================
DATABASE CONNECTION HELPER

Next.js can execute server-side code multiple times,
especially during development.

We don't want to create a new PostgreSQL connection
every time some server code needs the database.

This helper initializes the existing TypeORM DataSource
only when it has not already been initialized.
==========================================================
*/

export async function connectDatabase() {
    /*
    If TypeORM is already connected, reuse the existing
    connection instead of initializing another one.
    */
    if (database.isInitialized) {
        return database;
    }

    /*
    Initialize the DataSource.

    This reads the PostgreSQL configuration from:

    config/database.ts
    */
    const connectionStartedAt = Date.now();

    try {
        await database.initialize();

        // This appears in Vercel Runtime Logs and tells us whether a cold database
        // connection is responsible for a slow first request.
        console.log(JSON.stringify({
            level: "info",
            message: "Database connection ready",
            duration_ms: Date.now() - connectionStartedAt,
        }));

        return database;
    } catch (error) {
        console.error(JSON.stringify({
            level: "error",
            message: "Database connection failed",
            duration_ms: Date.now() - connectionStartedAt,
            error: error instanceof Error ? error.message : String(error),
        }));

        throw error;
    }
}
