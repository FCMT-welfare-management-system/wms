import * as p from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const timeStamps = {
	createdAt: p.timestamp().defaultNow().notNull(),
	updatedAt: p.timestamp().defaultNow().notNull(),
};

const createIdColumn = () => p.uuid().defaultRandom().primaryKey();
export const userRoleEnum = p.pgEnum("user_role", ["user", "admin"]);
export const campaignStatusEnum = p.pgEnum("campaign_status", [
	"active",
	"completed",
	"cancelled",
]);
export const campaignCategoryEnum = p.pgEnum("campaign_category", [
	"tuition_assistance",
	"medical_emergency",
	"housing_support",
	"books_supplies",
	"food_security",
	"transport_assistance",
	"tech_resources",
	"other",
]);

// Users table
export const users = p.pgTable("users", {
	id: createIdColumn(),
	name: p.varchar({ length: 100 }).notNull(),
	email: p.varchar({ length: 255 }).notNull().unique(),
	username: p.varchar({ length: 50 }).notNull().unique(),
	passwordHash: p.text().notNull(),
	role: userRoleEnum("user").notNull().default("user"),
	...timeStamps,
});

export const sessions = p.pgTable("sessions", {
	id: createIdColumn(),
	userId: p
		.uuid()
		.notNull()
		.references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
	expiresAt: p.timestamp().notNull(),
	...timeStamps,
});

export const userImages = p.pgTable("user_images", {
	id: createIdColumn(),
	userId: p
		.uuid()
		.notNull()
		.references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
	url: p.varchar({ length: 500 }).notNull(),
	cloudinaryId: p.varchar({ length: 200 }),
	altText: p.varchar({ length: 200 }),
	contentType: p.varchar({ length: 50 }),
	...timeStamps,
});

export const campaignImages = p.pgTable("campaign_images", {
	id: createIdColumn(),
	campaignId: p
		.uuid()
		.notNull()
		.references(() => campaigns.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
	url: p.varchar({ length: 500 }).notNull(),
	cloudinaryId: p.varchar({ length: 200 }),
	altText: p.varchar({ length: 200 }),
	contentType: p.varchar({ length: 50 }),
	...timeStamps,
});

export const campaigns = p.pgTable("campaigns", {
	id: createIdColumn(),
	title: p.varchar({ length: 200 }).notNull(),
	description: p.text().notNull(),
	goal: p.integer().notNull(),
	raised: p.integer().default(0).notNull(),
	category: campaignCategoryEnum("other").notNull(),
	status: campaignStatusEnum("active").notNull(),
	startDate: p.timestamp().defaultNow().notNull(),
	endDate: p.timestamp(),
	...timeStamps,
});

export const donations = p.pgTable("donations", {
	id: createIdColumn(),
	campaignId: p
		.uuid()
		.notNull()
		.references(() => campaigns.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
	userId: p
		.uuid()
		.notNull()
		.references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
	amount: p.integer().notNull(),
	message: p.text(),
	anonymous: p.boolean().default(false).notNull(),
	...timeStamps,
});

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	campaigns: many(campaigns),
	donations: many(donations),
	images: many(userImages),
}));

export const userImagesRelations = relations(userImages, ({ one }) => ({
	user: one(users, {
		fields: [userImages.userId],
		references: [users.id],
	}),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export const campaignImagesRelations = relations(campaignImages, ({ one }) => ({
	campaign: one(campaigns, {
		fields: [campaignImages.campaignId],
		references: [campaigns.id],
	}),
}));

export const campaignsRelations = relations(campaigns, ({ many }) => ({
	donations: many(donations),
	images: many(campaignImages),
}));

export const donationsRelations = relations(donations, ({ one }) => ({
	campaign: one(campaigns, {
		fields: [donations.campaignId],
		references: [campaigns.id],
	}),
	donor: one(users, {
		fields: [donations.userId],
		references: [users.id],
	}),
}));
