import bcrypt from "bcryptjs";
import { db } from "./context";
import { users } from "./schema";

const testDb = async () => {
	const password = "kodylovesyou";
	const passwordHash = await bcrypt.hash(password, 10);

	const result = await db
		.insert(users)
		.values({
			name: "kody the koala",
			email: "kody@thekoala.com",
			username: "kody",
			passwordHash,
		})
		.returning({
			insertedId: users.id,
		});
	console.log("⚡done all success");
	console.log(result);
};

void testDb();
