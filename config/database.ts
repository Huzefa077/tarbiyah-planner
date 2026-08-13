import "reflect-metadata";
import "pg";
import { DataSource } from "typeorm";
import { User } from "@/database/entities/User";
import { Planner } from "@/database/entities/Planner";
import { Section } from "@/database/entities/Section";
import { Activity } from "@/database/entities/Activity";

/*
==========================================================
TYPEORM DATABASE CONFIGURATION

This file defines HOW TypeORM connects to PostgreSQL.

It supports:

1. DATABASE_URL
   → Useful for hosted PostgreSQL databases such as Neon.

2. Individual DB_* variables
   → Useful for local PostgreSQL development.

The same configuration can therefore work locally
and in production.
==========================================================
*/

export const database = new DataSource({
    type: "postgres",

    // ----------------------------------------------------
    // Database connection
    // ----------------------------------------------------

    // If DATABASE_URL exists, TypeORM uses it.
    url: process.env.DATABASE_URL,

    // These are used when DATABASE_URL is not provided.
    host: process.env.DB_HOST,

    port: process.env.DB_PORT
        ? Number(process.env.DB_PORT)
        : 5432,

    username: process.env.DB_USERNAME,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_DATABASE,

    // ----------------------------------------------------
    // Development schema handling
    // ----------------------------------------------------

    /*
    During our MVP development, DB_SYNC=true allows
    TypeORM to create/update tables automatically.

    Example:

    DB_SYNC=true

    Later, when the database structure is stable,
    we will switch to migrations and set:

    DB_SYNC=false
    */
    synchronize: process.env.DB_SYNC === "true",

    // Keep SQL logging off unless debugging.
    logging: false,

    // ----------------------------------------------------
    // Entities
    // ----------------------------------------------------

    /*
    These are the database models TypeORM manages.

    User
       ↓
    Planner
       ↓
    Section
       ↓
    Activity
    */
    entities: [
        User,
        Planner,
        Section,
        Activity,
    ],

    // We are not using migrations yet.
    // We will introduce them after the MVP database works.
    migrations: [],
});