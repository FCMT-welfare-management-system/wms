import { cn } from "~/utils/misc";

export type ListOfErrors = Array<string | null | undefined> | null | undefined;

export function getFieldError(errors: ListOfErrors) {
	return errors?.filter(Boolean)[0];
}

export function ErrorList({
	id,
	errors,
	className,
}: {
	errors?: ListOfErrors;
	id?: string;
	className?: string;
}) {
	const errorsToRender = errors?.filter(Boolean);
	if (!errorsToRender?.length) return null;
	return (
		<ul id={id} className={cn("flex flex-col gap-1", className)}>
			{errorsToRender.map((e) => (
				<li key={e} className="text-xs text-input-invalid">
					{e}
				</li>
			))}
		</ul>
	);
}
