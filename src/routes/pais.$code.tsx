import { createFileRoute, notFound } from "@tanstack/react-router";
import BackButton from "#/components/BackButton";
import { buttonClasses } from "#/components/Button";
import Chip from "#/components/Chip";
import Flag from "#/components/Flag";
import StatusMessage from "#/components/StatusMessage";
import {
	countryName,
	formatNumber,
	getCountry,
	getCountryNames,
	regionLabel,
} from "#/lib/countries";

export const Route = createFileRoute("/pais/$code")({
	loader: async ({ params }) => {
		const country = await getCountry({ data: params.code });
		if (!country) throw notFound();
		const borders = await getCountryNames({ data: country.borders ?? [] });
		return { country, borders };
	},
	head: ({ loaderData }) => ({
		meta: [
			{
				title: loaderData
					? `${countryName(loaderData.country)} — Explorer`
					: "País no encontrado — Explorer",
			},
		],
	}),
	notFoundComponent: () => (
		<main
			id="contenido"
			className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-lg px-lg py-lg md:py-xl"
		>
			<StatusMessage
				title="País no encontrado"
				description="No existe un país con ese código. Vuelve al listado para seguir explorando."
			/>
		</main>
	),
	component: CountryPage,
});

const drivingSide: Record<string, string> = {
	left: "Izquierda",
	right: "Derecha",
};

function CountryPage() {
	const { country, borders } = Route.useLoaderData();
	const name = countryName(country);
	const officialName =
		country.names.translations?.spa?.official ?? country.names.official;

	const facts = [
		{
			label: "Capital",
			value: country.capitals?.map((c) => c.name).join(", "),
		},
		{ label: "Población", value: `${formatNumber(country.population)} hab.` },
		{
			label: "Área",
			value: country.area
				? `${formatNumber(country.area.kilometers)} km²`
				: undefined,
		},
		{
			label: "Idiomas",
			value: country.languages?.map((l) => l.name).join(", "),
		},
		{
			label: "Monedas",
			value: country.currencies
				?.map((c) => `${c.name} (${c.symbol ?? c.code})`)
				.join(", "),
		},
		{ label: "Zona horaria", value: country.timezones?.join(", ") },
		{
			label: "Prefijo telefónico",
			value: country.calling_codes?.map((c) => `+${c}`).join(", "),
		},
		{ label: "Dominio", value: country.tlds?.join(", ") },
		{
			label: "Conducción",
			value: country.cars?.driving_side
				? drivingSide[country.cars.driving_side]
				: undefined,
		},
		{
			label: "Miembro de la ONU",
			value: country.classification?.un_member ? "Sí" : "No",
		},
	].filter((fact) => fact.value);

	const mapUrl = country.links?.google_maps ?? country.links?.open_street_maps;

	return (
		<main
			id="contenido"
			className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-lg px-lg py-lg md:py-xl"
		>
			<nav aria-label="Navegación secundaria">
				<BackButton />
			</nav>

			<article className="grid grid-cols-1 gap-lg md:grid-cols-[280px_minmax(0,1fr)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-2xl">
				{/* Bandera */}
				<figure className="flex flex-col gap-sm self-start md:sticky md:top-28">
					<div className="rounded-md border border-border bg-surface p-md shadow-card">
						<Flag
							src={country.flag?.url_svg}
							emoji={country.flag?.emoji}
							name={name}
							fit="contain"
							className="aspect-[3/2] w-full"
						/>
					</div>
					{country.flag?.description && (
						<figcaption className="hidden text-label text-text-secondary lg:block">
							{country.flag.description}
						</figcaption>
					)}
				</figure>

				<div className="flex min-w-0 flex-col gap-lg">
					<header className="flex flex-col gap-xs">
						<p className="text-label text-secondary">
							{regionLabel(country.region)}
							{country.subregion ? ` · ${country.subregion}` : ""}
						</p>
						<h1 className="text-title text-text-primary lg:text-display">
							{name}
						</h1>
						{officialName && officialName !== name && (
							<p className="text-body text-text-secondary">{officialName}</p>
						)}
					</header>

					{/* Datos clave */}
					<section
						aria-labelledby="datos-title"
						className="flex flex-col gap-sm"
					>
						<h2 id="datos-title" className="sr-only">
							Datos clave
						</h2>
						<dl className="grid grid-cols-2 gap-sm xl:grid-cols-3">
							{facts.map((fact) => (
								<div
									key={fact.label}
									className="flex flex-col gap-xs rounded-md border border-border bg-surface p-md"
								>
									<dt className="text-label text-text-secondary">
										{fact.label}
									</dt>
									<dd className="text-card break-words text-text-primary">
										{fact.value}
									</dd>
								</div>
							))}
						</dl>
					</section>

					{country.descriptions?.long && (
						<section
							aria-labelledby="descripcion-title"
							className="flex flex-col gap-sm"
						>
							<h2
								id="descripcion-title"
								className="text-card text-text-primary"
							>
								Descripción
							</h2>
							<p
								className="max-w-[65ch] text-body text-text-secondary"
								lang="en"
							>
								{country.descriptions.long}
							</p>
						</section>
					)}

					<section
						aria-labelledby="fronteras-title"
						className="flex flex-col gap-sm"
					>
						<h2 id="fronteras-title" className="text-card text-text-primary">
							Países fronterizos
						</h2>
						{borders.length > 0 ? (
							<ul className="flex flex-wrap gap-sm">
								{borders.map((border) => (
									<li key={border.code}>
										<Chip to="/pais/$code" params={{ code: border.code }}>
											{border.name}
										</Chip>
									</li>
								))}
							</ul>
						) : (
							<p className="text-label text-text-secondary">
								{country.landlocked === false
									? "No comparte fronteras terrestres."
									: "Sin fronteras registradas."}
							</p>
						)}
					</section>

					{(mapUrl || country.links?.wikipedia) && (
						<div className="flex flex-col gap-sm sm:flex-row">
							{mapUrl && (
								<a
									href={mapUrl}
									target="_blank"
									rel="noreferrer"
									className={buttonClasses("primary")}
								>
									Ver en el mapa
								</a>
							)}
							{country.links?.wikipedia && (
								<a
									href={country.links.wikipedia}
									target="_blank"
									rel="noreferrer"
									className={buttonClasses("outline")}
								>
									Leer en Wikipedia
								</a>
							)}
						</div>
					)}
				</div>
			</article>
		</main>
	);
}
