import { useInputControl } from "@conform-to/react";
import { Checkbox, type CheckboxProps } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Input, type InputProps } from "./ui/input";
import { ErrorList, type ListOfErrors } from "./ui/errorList";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { cn } from "#app/utils/misc";
import { useId } from "react";

interface FieldProps {
	labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
	inputProps: InputProps;
	errors?: ListOfErrors;
	className?: string;
	icon?: IconDefinition;
}

export function Field({
	labelProps,
	inputProps,
	errors,
	className,
	icon,
}: FieldProps) {
	const fallbackId = useId();
	const id = inputProps.id ?? fallbackId;
	const errorId = errors?.length ? `${id}-error` : undefined;

	return (
		<div className={cn("space-y-2", className)}>
			<Label htmlFor={id} {...labelProps} />
			<Input
				id={id}
				aria-invalid={errorId ? true : undefined}
				aria-describedby={errorId}
				icon={icon}
				hasError={Boolean(errors?.length)}
				{...inputProps}
			/>
			<div className="min-h-[32px] pb-3 pt-1">
				{errorId ? <ErrorList id={errorId} errors={errors} /> : null}
			</div>
		</div>
	);
}

export function CheckboxField({
	labelProps,
	buttonProps,
	errors,
	className,
}: {
	labelProps: React.ComponentProps<"label">;
	buttonProps: CheckboxProps & {
		name: string;
		form: string;
		value?: string;
		key?: string;
	};
	errors?: ListOfErrors;
	className?: string;
}) {
	const { key, defaultChecked, ...checkboxProps } = buttonProps;
	const fallbackId = useId();
	const checkedValue = buttonProps.value ?? "on";
	const input = useInputControl({
		key,
		name: buttonProps.name,
		formId: buttonProps.form,
		initialValue: defaultChecked ? checkedValue : undefined,
	});
	const id = buttonProps.id ?? fallbackId;
	const errorId = errors?.length ? `${id}-error` : undefined;

	return (
		<div className={className}>
			<div className="flex gap-2">
				<Checkbox
					{...checkboxProps}
					id={id}
					aria-invalid={errorId ? true : undefined}
					aria-describedby={errorId}
					checked={input.value === checkedValue}
					onCheckedChange={(state) => {
						input.change(state ? checkedValue : "");
						buttonProps.onCheckedChange?.(state);
					}}
					onFocus={(event) => {
						input.focus();
						buttonProps.onFocus?.(event);
					}}
					onBlur={(event) => {
						input.blur();
						buttonProps.onBlur?.(event);
					}}
					type="button"
				/>
				<label
					htmlFor={id}
					{...labelProps}
					className={cn(
						"self-center text-body-xs text-muted-foreground",
						labelProps.className,
					)}
				/>
			</div>
			<div className="px-4 pb-3 pt-1">
				{errorId ? <ErrorList id={errorId} errors={errors} /> : null}
			</div>
		</div>
	);
}
