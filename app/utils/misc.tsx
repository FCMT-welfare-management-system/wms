import { useFormAction, useNavigation } from "react-router";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function useIsPending({
	formAction,
	formMethod = "POST",
	state = "non-idle",
}: {
	formAction?: string;
	formMethod?: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
	state?: "submitting" | "loading" | "non-idle";
} = {}) {
	const contextualFormAction = useFormAction();
	const navigation = useNavigation();
	const isPendingState =
		state === "non-idle"
			? navigation.state !== "idle"
			: navigation.state === state;
	return (
		isPendingState &&
		navigation.formAction === (formAction ?? contextualFormAction) &&
		navigation.formMethod === formMethod
	);
}

export function getErrorMessage(error: unknown): string {
	if (typeof error === "string") return error;
	if (
		error &&
		typeof error === "object" &&
		"message" in error &&
		typeof error.message === "string"
	) {
		return error.message;
	}
	console.error("Unable to get error message for error", error);
	return "Unknown Error";
}
