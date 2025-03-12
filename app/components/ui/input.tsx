import React, { forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { cn } from "~/utils/misc";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	icon?: IconDefinition;
	hasError?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, icon, hasError, ...props }, ref) => {
		return (
			<div className="relative w-full">
				{icon && (
					<div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
						<FontAwesomeIcon icon={icon} />
					</div>
				)}
				<input
					className={cn(
						"w-full py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring",
						icon ? "pl-10 pr-3" : "px-3",
						hasError ? "border-red-500" : "border-input",
						className,
					)}
					ref={ref}
					{...props}
				/>
			</div>
		);
	},
);

Input.displayName = "Input";

export { Input };
