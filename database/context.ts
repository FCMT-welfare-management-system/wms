import * as schema from "./schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { init } from "~/utils/env.server";

const mode = process.env.NODE_ENV || "development";
if (mode === "development") await import("dotenv/config");

init();

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle({ client: sql, schema: schema });
