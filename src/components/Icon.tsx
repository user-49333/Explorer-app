import type { CSSProperties } from "react";

type IconProps = {
	src: string;
	className?: string;
};

/**
 * Pinta un icono exportado de Figma como mascara CSS: conserva la forma del SVG
 * pero toma el color del texto (text-*), asi se adapta al tema claro y oscuro.
 */
export default function Icon({ src, className = "size-6" }: IconProps) {
	return (
		<span
			aria-hidden="true"
			style={{ "--icon": `url("${src}")` } as CSSProperties}
			className={`inline-block shrink-0 bg-current [mask:var(--icon)_center/contain_no-repeat] ${className}`}
		/>
	);
}
