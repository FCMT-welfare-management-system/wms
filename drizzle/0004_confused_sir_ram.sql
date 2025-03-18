CREATE TYPE "public"."campaign_category" AS ENUM('tuition_assistance', 'medical_emergency', 'housing_support', 'books_supplies', 'food_security', 'transport_assistance', 'tech_resources', 'other');--> statement-breakpoint
CREATE TYPE "public"."campaign_status" AS ENUM('active', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "campaign_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"url" varchar(500) NOT NULL,
	"cloudinary_id" varchar(200),
	"alt_text" varchar(200),
	"content_type" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"goal" integer NOT NULL,
	"raised" integer DEFAULT 0 NOT NULL,
	"other" "campaign_category" NOT NULL,
	"active" "campaign_status" NOT NULL,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp,
	"creator_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "donations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"message" text,
	"anonymous" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"url" varchar(500) NOT NULL,
	"cloudinary_id" varchar(200),
	"alt_text" varchar(200),
	"content_type" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
