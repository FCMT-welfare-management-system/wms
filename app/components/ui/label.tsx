import { forwardRef } from "react";
import { cn } from "~/utils/misc";

export interface LabelProps
	extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
	({ className, ...props }, ref) => {
		return (
			<label
				className={cn("text-body-sm text-muted-foreground block", className)}
				ref={ref}
				{...props}
			/>
		);
	},
);

Label.displayName = "Label";

export { Label };
