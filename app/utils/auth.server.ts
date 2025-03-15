import * as bcrypt from "bcryptjs";
import { db } from "database/context";
import { users, sessions } from "database/schema";
import { authSessionStorage } from "./session.server";
import { Column, eq } from "drizzle-orm";

export async function getPasswordHash(password: string) {
	const hash = await bcrypt.hash(password, 10);
	return hash;
}
export const sessionKey = "session-key";

export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30; // 30 days

export const getSessionExpirationDate = () =>
	new Date(Date.now() + SESSION_EXPIRATION_TIME);

export const getUserId = async (request: Request) => {
	const authSession = await authSessionStorage.getSession(
		request.headers.get("cookie"),
	);

	const sessionId = authSession.get(sessionKey);
	if (!sessionId) return null;

	const userResults = await db
		.select({
			userId: sessions.userId,
		})
		.from(sessions)
		.where(eq(sessions.id, sessionId));

	return userResults.length > 0 ? userResults[0].userId : null;
};

export async function signUp({
	email,
	username,
	password,
	name,
}: {
	email: (typeof users.$inferInsert)["email"];
	username: (typeof users.$inferInsert)["username"];
	name: (typeof users.$inferInsert)["name"];
	password: string;
}) {
	const passwordHash = await getPasswordHash(password);
	const expiresAt = getSessionExpirationDate();
	const [{ userId }] = await db
		.insert(users)
		.values({
			name,
			email,
			username,
			passwordHash,
		})
		.returning({
			userId: users.id,
		});
	const [{ sessionId }] = await db
		.insert(sessions)
		.values({
			userId,
			expiresAt,
		})
		.returning({
			sessionId: sessions.id,
		});
	if (sessionId)
		return {
			id: sessionId,
			expiresAt,
		};
	return null;
}
