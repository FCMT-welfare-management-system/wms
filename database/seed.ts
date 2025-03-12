import { db } from "./context";
import { users } from "./schema";

const testDb = async () => {
	console.log("inserting to the db");
	await db.insert(users).values({
		name: "kody",
		email: "kody@thekoala.com",
	});
	console.log("⚡done all success");
};

void testDb();
