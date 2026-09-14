type FlagProps = {
	src?: string;
	emoji?: string;
	name: string;
	className?: string;
	fit?: "cover" | "contain";
};

/** Bandera (Figma 3:24): marco 64x48 con radio sm y borde; el tamano se ajusta con className */
export default function Flag({
	src,
	emoji,
	name,
	className = "h-12 w-16 rounded-sm border border-border bg-surface-subtle",
	fit = "cover",
}: FlagProps) {
	return (
		<div
			className={`flex shrink-0 items-center justify-center overflow-hidden ${className}`}
		>
			{src ? (
				<img
					src={src}
					alt={`Bandera de ${name}`}
					loading="lazy"
					className={`size-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
				/>
			) : (
				<span
					role="img"
					aria-label={`Bandera de ${name}`}
					className="text-title"
				>
					{emoji || name.slice(0, 2).toUpperCase()}
				</span>
			)}
		</div>
	);
}
