import * as React from "react";
import { cn } from "~/utils/misc";

type BaseCheckboxProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"checked" | "onChange"
>;

export interface CheckboxProps extends BaseCheckboxProps {
	onCheckedChange?: (checked: boolean | "indeterminate") => void;
	checked?: boolean | "indeterminate";
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
	({ className, checked, onCheckedChange, ...props }, ref) => {
		const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
			onCheckedChange?.(event.target.checked);
		};

		return (
			<div className={cn("relative flex items-center", className)}>
				<input
					type="checkbox"
					className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
					checked={checked === "indeterminate" ? false : checked}
					onChange={handleChange}
					ref={ref}
					{...props}
				/>
				{checked === "indeterminate" && (
					<div
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-current"
						aria-hidden="true"
					/>
				)}
			</div>
		);
	},
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
