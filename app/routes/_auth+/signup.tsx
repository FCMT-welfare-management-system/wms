import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { data, Form, Link, redirect } from "react-router";
import { faLock, faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/ui/button";
import { z } from "zod";
import type { Route } from "./+types/signup.ts";
import { ErrorList } from "../../components/ui/errorList";
import { Field } from "~/components/forms";
import {
	EmailSchema,
	NameSchema,
	PasswordSchema,
	UsernameSchema,
} from "~/utils/user_validation";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { sessionKey, signUp } from "~/utils/auth.server";
import { authSessionStorage } from "~/utils/session.server";

export function meta() {
	return [
		{ title: "Sign Up - Kabarak Student Welfare Management System" },
		{
			name: "description",
			content:
				"Create an account for the Kabarak Student Welfare Management System",
		},
	];
}

const SignupSchema = z
	.object({
		email: EmailSchema,
		password: PasswordSchema,
		name: NameSchema,
		username: UsernameSchema,
		confirmPassword: z.string(),
		rememberMe: z.boolean().optional().default(false),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});
//TODO: if the user is already logged in kick them out.

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData();
	const session = await authSessionStorage.getSession(
		request.headers.get("cookie"),
	);
	const submission = await parseWithZod(formData, {
		schema: () =>
			SignupSchema.transform(async (data, ctx) => {
				const session = await signUp(data);
				if (session === null) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "Invalid username or password",
					});
					return z.NEVER;
				}
				return { ...data, session };
			}),
		async: true,
	});

	if (submission.status !== "success") {
		console.log("something went wrong .. ,", submission.reply());
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

export default function SignupPage({ actionData }: Route.ComponentProps) {
	const [form, fields] = useForm({
		id: "signup-form",
		constraint: getZodConstraint(SignupSchema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: SignupSchema });
		},
		shouldRevalidate: "onBlur",
	});

	return (
		<div className="flex-1 flex justify-center items-center px-4 py-12">
			<div className="w-full max-w-md bg-background/80 backdrop-blur-sm rounded-lg shadow-md p-8">
				<div className="flex justify-center mb-6">
					<img
						src="/kabu-logo-Beveled-shadow.png"
						alt="Kabarak University Logo"
						className="h-16"
					/>
				</div>

				<h2 className="text-h4 font-bold text-brand text-center mb-6">
					Sign Up
				</h2>

				<Form method="post" {...getFormProps(form)} className="space-y-1">
					<Field
						labelProps={{ children: "username" }}
						inputProps={{
							...getInputProps(fields.username, { type: "text" }),
							placeholder: "Username",
							required: true,
						}}
						icon={faEnvelope}
						errors={fields.username.errors}
					/>

					<Field
						labelProps={{ children: "Email" }}
						inputProps={{
							...getInputProps(fields.email, { type: "email" }),
							placeholder: "University email address",
							required: true,
						}}
						icon={faEnvelope}
						errors={fields.email.errors}
					/>

					<Field
						labelProps={{ children: "Full Name" }}
						inputProps={{
							...getInputProps(fields.name, { type: "text" }),
							placeholder: "Full name",
							required: true,
						}}
						icon={faUser}
						errors={fields.name.errors}
					/>

					<Field
						labelProps={{ children: "Password" }}
						inputProps={{
							...getInputProps(fields.password, { type: "password" }),
							placeholder: "Password",
							required: true,
						}}
						icon={faLock}
						errors={fields.password.errors}
					/>

					<Field
						labelProps={{ children: "Confirm Password" }}
						inputProps={{
							...getInputProps(fields.confirmPassword, { type: "password" }),
							placeholder: "Confirm password",
							required: true,
						}}
						icon={faLock}
						errors={fields.confirmPassword.errors}
					/>

					<div className="flex items-center space-x-2 mt-3">
						<Checkbox
							{...getInputProps(fields.rememberMe, {
								type: "checkbox",
							})}
							onCheckedChange={(checked) => {
								const value = checked === true;
								const input = document.createElement("input");
								input.type = "checkbox";
								input.name = fields.rememberMe.name;
								input.checked = value;
								const event = new Event("change", { bubbles: true });
								input.dispatchEvent(event);
								const formElement = document.getElementById(form.id);
								formElement?.appendChild(input);
								requestAnimationFrame(() => {
									formElement?.removeChild(input);
								});
							}}
							id="remember-me"
						/>
						<Label htmlFor="remember-me" className="text-body-sm">
							Remember me
						</Label>
					</div>

					{form.errors && (
						<div className="rounded-md bg-red-50 p-3">
							<div className="flex gap-2 text-red-700">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									className="h-5 w-5 flex-shrink-0"
								>
									<title>Close</title>
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

					<Button variant="accent" fullWidth type="submit" className="mt-4">
						Sign Up
					</Button>
				</Form>

				<div className="mt-8 pt-6 border-t border-border text-center">
					<p className="text-muted-foreground">
						Already have an account?{" "}
						<Link
							to="/login"
							className="text-brand font-medium hover:underline"
						>
							Log in
						</Link>
					</p>
				</div>

				<div className="mt-6 text-center">
					<Link to="/" className="text-brand hover:underline text-body-sm">
						Back to Home
					</Link>
				</div>
			</div>
		</div>
	);
}
