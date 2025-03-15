import { useForm, getFormProps, getInputProps } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import {
	Form,
	Link,
	data,
	redirect,
	type ActionFunctionArgs,
} from "react-router";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/ui/button";
import { Field } from "../../components/forms";
import { PasswordSchema } from "../../utils/user_validation";
import { z } from "zod";
import type { Route } from "./+types/login";
import { CheckboxField } from "~/components/forms";
import { sessionKey, login } from "~/utils/auth.server";
import { authSessionStorage } from "~/utils/session.server";
import { ErrorList } from "../../components/ui/errorList";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Login - Kabarak Student Welfare Management System" },
		{
			name: "description",
			content: "Login to access the Kabarak Student Welfare Management System",
		},
	];
}

const LoginSchema = z.object({
	emailOrUsername: z.string().min(1, "Email or username is required"),
	password: PasswordSchema,
	rememberMe: z.boolean().optional().default(false),
});

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const session = await authSessionStorage.getSession(
		request.headers.get("cookie"),
	);

	const submission = await parseWithZod(formData, {
		schema: () =>
			LoginSchema.transform(async (data, ctx) => {
				const userSession = await login({
					emailOrUsername: data.emailOrUsername,
					password: data.password,
				});

				if (userSession === null) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "Invalid email/username or password",
					});
					return z.NEVER;
				}
				return { ...data, session: userSession };
			}),
		async: true,
	});

	if (submission.status !== "success") {
		return data(
			{ result: submission.reply() },
			{
				status: 400,
			},
		);
	}

	session.set(sessionKey, submission.value.session.id);

	return redirect("/", {
		headers: {
			"set-cookie": await authSessionStorage.commitSession(session, {
				expires: submission.value.rememberMe
					? submission.value.session.expiresAt
					: undefined,
			}),
		},
	});
}

export default function LoginPage({ actionData }: { actionData?: any }) {
	const [form, fields] = useForm({
		id: "login-form",
		constraint: getZodConstraint(LoginSchema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: LoginSchema });
		},
		shouldRevalidate: "onBlur",
	});

	return (
		<main className="flex flex-col min-h-screen bg-gradient-to-b from-muted to-accent-brand/30">
			<div className="flex-1 flex justify-center items-center px-4 py-12">
				<div className="w-full max-w-md bg-background/80 backdrop-blur-sm rounded-lg shadow-md p-8">
					<h2 className="text-h4 font-bold text-brand text-center mb-6">
						Login
					</h2>

					<Form method="post" {...getFormProps(form)} className="space-y-6">
						<Field
							labelProps={{ children: "Email or Username" }}
							inputProps={{
								...getInputProps(fields.emailOrUsername, { type: "text" }),
								placeholder: "Email address or username",
								autoComplete: "username",
								icon: faUser,
							}}
							errors={fields.emailOrUsername.errors}
						/>

						<Field
							labelProps={{ children: "Password" }}
							inputProps={{
								...getInputProps(fields.password, { type: "password" }),
								placeholder: "Password",
								autoComplete: "current-password",
								icon: faLock,
							}}
							errors={fields.password.errors}
						/>
						<CheckboxField
							labelProps={{
								children: "Remember me",
							}}
							buttonProps={getInputProps(fields.rememberMe, {
								type: "checkbox",
							})}
							errors={fields.rememberMe.errors}
							className="mt-2"
						/>

						{form.errors && (
							<div className="rounded-md bg-red-50 p-3">
								<div className="flex gap-2 text-red-700">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										className="h-5 w-5 flex-shrink-0"
									>
										<title>Error</title>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
											clipRule="evenodd"
										/>
									</svg>
									<div>
										<ErrorList errors={form.errors} />
									</div>
								</div>
							</div>
						)}

						<Button variant="accent" fullWidth type="submit">
							Log In
						</Button>

						<div className="text-center text-body-sm text-muted-foreground">
							<Link
								to="/forgot-password"
								className="text-brand hover:underline"
							>
								Forgot password?
							</Link>
						</div>
					</Form>

					<div className="mt-8 pt-6 border-t border-border text-center">
						<p className="text-muted-foreground">
							Don't have an account?{" "}
							<Link
								to="/signup"
								className="text-brand font-medium hover:underline"
							>
								Sign up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}
