import { getErrorMessage } from "#app/utils/misc.js";
import { type ReactElement } from "react";
import {
	type ErrorResponse,
	isRouteErrorResponse,
	useParams,
	useRouteError,
} from "react-router";
import {
	NotFoundComponent,
	UnauthorizedComponent,
	ForbiddenComponent,
	ServerErrorComponent,
	UnexpectedErrorComponent,
} from "./errorComponents";

type StatusHandler = (info: {
	error: ErrorResponse;
	params: Record<string, string | undefined>;
}) => ReactElement | null;

export function GeneralErrorBoundary({
	defaultStatusHandler = () => <NotFoundComponent />,
	statusHandlers = {
		400: () => <NotFoundComponent />,
		402: () => <UnauthorizedComponent />,
		403: () => <ForbiddenComponent />,
		404: () => <NotFoundComponent />,
		500: () => <ServerErrorComponent />,
		503: () => <ServerErrorComponent />,
	},
	unexpectedErrorHandler = (error) => (
		<UnexpectedErrorComponent error={error} />
	),
}: {
	defaultStatusHandler?: StatusHandler;
	statusHandlers?: Record<number, StatusHandler>;
	unexpectedErrorHandler?: (error: unknown) => ReactElement | null;
}) {
	const error = useRouteError();
	const params = useParams();
	const isResponse = isRouteErrorResponse(error);

	if (typeof document !== "undefined") {
		console.error("Error caught by GeneralErrorBoundary:", error);
	}

	return (
		<div className="container flex items-center justify-center p-8 min-h-[70vh]">
			{isResponse
				? (statusHandlers?.[error.status] ?? defaultStatusHandler)({
						error,
						params,
					})
				: unexpectedErrorHandler(error)}
		</div>
	);
}
