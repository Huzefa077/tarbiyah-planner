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
    await database.initialize();

    console.log("Database connected successfully.");

    return database;
}