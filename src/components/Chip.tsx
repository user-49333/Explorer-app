import { createLink, type LinkComponent } from "@tanstack/react-router";
import { type AnchorHTMLAttributes, forwardRef } from "react";
import activeDot from "#/assets/icons/indicador-activo.svg";
import Icon from "./Icon";

type ChipAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
	selected?: boolean;
};

/**
 * Chip filtro (Figma 5:8). El estado seleccionado cambia color, grosor de borde
 * y muestra un punto indicador para no depender unicamente del color.
 */
const ChipAnchor = forwardRef<HTMLAnchorElement, ChipAnchorProps>(
	({ selected = false, className = "", children, ...props }, ref) => (
		<a
			ref={ref}
			aria-current={selected ? "true" : undefined}
			className={`inline-flex h-chip shrink-0 items-center justify-center gap-sm whitespace-nowrap rounded-pill px-md text-button transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
				selected
					? "border-2 border-primary-active bg-primary text-text-on-primary"
					: "border border-border bg-surface text-text-secondary hover:border-primary hover:text-primary"
			} ${className}`}
			{...props}
		>
			{selected && <Icon src={activeDot} className="size-2" />}
			{children}
		</a>
	),
);

const CreatedChip = createLink(ChipAnchor);

const Chip: LinkComponent<typeof ChipAnchor> = (props) => (
	<CreatedChip preload="intent" {...props} />
);

export default Chip;
