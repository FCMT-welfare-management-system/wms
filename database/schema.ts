import * as p from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const timeStamps = {
	createdAt: p.timestamp().defaultNow().notNull(),
	updatedAt: p.timestamp().defaultNow().notNull(),
};

const createIdColumn = () => p.uuid().defaultRandom().primaryKey();

export const users = p.pgTable("users", {
	id: createIdColumn(),
	name: p.varchar({ length: 100 }).notNull(),
	email: p.varchar({ length: 255 }).notNull().unique(),
	username: p.varchar({ length: 50 }).notNull().unique(),
	passwordHash: p.text().notNull(),
	...timeStamps,
});

export const sessions = p.pgTable("sessions", {
	id: createIdColumn(),
	userId: p.uuid().notNull(),
	expiresAt: p.timestamp().notNull(),
	...timeStamps,
});

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));
