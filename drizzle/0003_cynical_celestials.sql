CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user" "user_role" DEFAULT 'user' NOT NULL;