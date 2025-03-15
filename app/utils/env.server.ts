import { z } from "zod";

const schema = z.object({
	NODE_ENV: z.enum(["production", "development", "test"] as const),
	DATABASE_URL: z.string(),
	SESSION_SECRET: z.string(),
});

type Env = z.infer<typeof schema>;

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Env {}
	}
}

export function init(): void {
	const parsed = schema.safeParse(process.env);

	if (parsed.success === false) {
		console.error(
			"❌ Invalid environment variables:",
			parsed.error.flatten().fieldErrors,
		);

		throw new Error("Invalid environment variables");
	}
}

export function getEnv(): Env {
	return schema.parse(process.env);
}
