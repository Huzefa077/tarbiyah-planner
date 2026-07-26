import "reflect-metadata";
import { DataSource } from "typeorm";

// Create the database connection config for the app
export const database = new DataSource({
  // Database type
  type: "postgres",

  // Connection details from environment variables
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  // Automatically sync the database schema with entities
  synchronize: true,

  // Show SQL logs in the console for debugging
  logging: false,

  // Entity and migration files will be added here later
  entities: [__dirname + "/../database/entities/*.{ts,js}"],
  migrations: [__dirname + "/../database/migrations/*.{ts,js}"],
});