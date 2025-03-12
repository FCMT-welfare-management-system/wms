import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
	id: p.uuid().defaultRandom().primaryKey(),
	name: p.text(),
	email: p.text().unique(),
});
