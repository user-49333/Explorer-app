import { Link } from "@tanstack/react-router";
import chevronRight from "#/assets/icons/chevron-right.svg";
import {
	type CountrySummary,
	countryId,
	countryName,
	formatPopulationShort,
	regionLabel,
} from "#/lib/countries";
import Flag from "./Flag";
import Icon from "./Icon";

/** Card pais (Figma 6:10) */
export default function CountryCard({ country }: { country: CountrySummary }) {
	const name = countryName(country);
	const capital = country.capitals?.[0]?.name;

	return (
		<Link
			to="/pais/$code"
			params={{ code: countryId(country) }}
			className="group flex min-h-card items-center gap-md rounded-md border border-border bg-surface p-md shadow-card transition hover:-translate-y-0.5 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
		>
			<Flag
				src={country.flag?.url_svg}
				emoji={country.flag?.emoji}
				name={name}
			/>
			<div className="flex min-w-0 flex-1 flex-col gap-xs">
				<h3 className="truncate text-card text-text-primary">{name}</h3>
				<p className="truncate text-label text-text-secondary">
					Capital: {capital ?? "—"}
				</p>
				<p className="truncate text-label text-text-secondary">
					{regionLabel(country.region)} ·{" "}
					{formatPopulationShort(country.population)}
				</p>
			</div>
			<Icon
				src={chevronRight}
				className="size-6 text-text-secondary transition group-hover:translate-x-1 group-hover:text-primary"
			/>
		</Link>
	);
}
