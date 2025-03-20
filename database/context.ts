import * as schema from "./schema";
import { drizzle } from "drizzle-orm/neon-http";

const mode = process.env.NODE_ENV || "development";

if (mode === "development") await import("dotenv/config");

const db = drizzle({
	connection: process.env.DATABASE_URL,
	schema,
	casing: "snake_case",
});

export { db };
