import { createServerFn } from "@tanstack/react-start";

/* ---------------------------------------------------------------------------
 * REST Countries v5 — https://restcountries.com/docs/countries
 * Las peticiones se hacen dentro de server functions: la API key se lee de
 * process.env en el servidor y nunca se envia al navegador.
 * ------------------------------------------------------------------------- */

const API_URL = "https://api.restcountries.com/countries/v5";

export const PAGE_SIZE = 24;

export const REGIONS = [
	{ value: "Africa", label: "África" },
	{ value: "Americas", label: "América" },
	{ value: "Asia", label: "Asia" },
	{ value: "Europe", label: "Europa" },
	{ value: "Oceania", label: "Oceanía" },
	{ value: "Antarctic", label: "Antártida" },
] as const;

export type RegionValue = (typeof REGIONS)[number]["value"];

export function isRegion(value: unknown): value is RegionValue {
	return REGIONS.some((region) => region.value === value);
}

export function regionLabel(value?: string) {
	return REGIONS.find((region) => region.value === value)?.label ?? value ?? "";
}

type Names = {
	common: string;
	official?: string;
	translations?: { spa?: { common: string; official: string } };
};

export type CountrySummary = {
	uuid: string;
	names: Names;
	codes: { alpha_3: string };
	capitals?: { name: string }[];
	flag?: { emoji?: string; url_svg?: string };
	region?: string;
	subregion?: string;
	population?: number;
};

export type CountryDetail = CountrySummary & {
	codes: { alpha_2: string; alpha_3: string };
	flag?: { emoji?: string; url_svg?: string; description?: string };
	area?: { kilometers: number };
	borders?: string[];
	calling_codes?: string[];
	cars?: { driving_side?: string };
	classification?: { un_member?: boolean; sovereign?: boolean };
	currencies?: { code: string; name: string; symbol?: string }[];
	descriptions?: { short?: string; long?: string };
	government_type?: string;
	landlocked?: boolean;
	languages?: { name: string; native_name?: string }[];
	links?: {
		google_maps?: string;
		open_street_maps?: string;
		wikipedia?: string;
		official?: string;
	};
	timezones?: string[];
	tlds?: string[];
};

type ApiResponse<T> = {
	data?: {
		objects: T[];
		meta: { total: number; count: number; limit: number; offset: number };
	};
	errors?: { message: string; code: string }[];
};

const SUMMARY_FIELDS = [
	"uuid",
	"names.common",
	"names.translations.spa",
	"codes.alpha_3",
	"capitals.name",
	"flag.emoji",
	"flag.url_svg",
	"region",
	"subregion",
	"population",
].join(",");

const DETAIL_FIELDS = [
	SUMMARY_FIELDS,
	"names.official",
	"codes.alpha_2",
	"flag.description",
	"area.kilometers",
	"borders",
	"calling_codes",
	"cars.driving_side",
	"classification.un_member",
	"classification.sovereign",
	"currencies",
	"descriptions",
	"government_type",
	"landlocked",
	"languages.name",
	"languages.native_name",
	"links",
	"timezones",
	"tlds",
].join(",");

async function request<T>(path: string, params: Record<string, string>) {
	const apiKey = process.env.RESTCOUNTRIES_API_KEY;
	if (!apiKey) {
		throw new Error(
			"Falta RESTCOUNTRIES_API_KEY. Copia .env.example a .env y agrega tu API key.",
		);
	}

	const url = `${API_URL}${path}?${new URLSearchParams(params)}`;
	const response = await fetch(url, {
		headers: { Authorization: `Bearer ${apiKey}` },
	});
	const json = (await response.json()) as ApiResponse<T>;

	if (!response.ok || !json.data) {
		throw new Error(
			json.errors?.[0]?.message ??
				`REST Countries respondió ${response.status}`,
		);
	}
	return json.data;
}

export type CountriesQuery = { q?: string; region?: RegionValue; page: number };

export const getCountries = createServerFn({ method: "GET" })
	.validator((input: CountriesQuery) => input)
	.handler(async ({ data }) => {
		const params: Record<string, string> = {
			limit: String(PAGE_SIZE),
			offset: String((data.page - 1) * PAGE_SIZE),
			response_fields: SUMMARY_FIELDS,
		};
		if (data.q) params.q = data.q;
		if (data.region) params.region = data.region;

		const result = await request<CountrySummary>("", params);
		return {
			countries: result.objects,
			total: result.meta.total,
			pageCount: Math.max(1, Math.ceil(result.meta.total / PAGE_SIZE)),
		};
	});

export const getCountry = createServerFn({ method: "GET" })
	.validator((code: string) => code)
	.handler(async ({ data: code }) => {
		// Los paises sin codigo ISO (p. ej. Abjasia) se identifican por uuid
		const path = /^[A-Za-z]{3}$/.test(code)
			? `/codes.alpha_3/${code.toUpperCase()}`
			: `/uuid/${encodeURIComponent(code)}`;
		const result = await request<CountryDetail>(path, {
			response_fields: DETAIL_FIELDS,
		});
		return result.objects[0] ?? null;
	});

// Indice codigo -> nombre, cacheado en memoria del servidor (el plan gratuito limita a 100 por pagina)
let namesIndex: Promise<Map<string, string>> | undefined;

function loadNamesIndex() {
	namesIndex ??= Promise.all(
		[0, 100, 200].map((offset) =>
			request<CountrySummary>("", {
				limit: "100",
				offset: String(offset),
				response_fields: "names.common,names.translations.spa,codes.alpha_3",
			}),
		),
	)
		.then(
			(pages) =>
				new Map(
					pages
						.flatMap((page) => page.objects)
						.map((country) => [country.codes.alpha_3, countryName(country)]),
				),
		)
		.catch((error) => {
			namesIndex = undefined;
			throw error;
		});
	return namesIndex;
}

export const getCountryNames = createServerFn({ method: "GET" })
	.validator((codes: string[]) => codes)
	.handler(async ({ data: codes }) => {
		if (codes.length === 0) return [];
		const index = await loadNamesIndex();
		return codes.map((code) => ({ code, name: index.get(code) ?? code }));
	});

/* ---------- Helpers de formato ---------- */

export function countryName(country: Pick<CountrySummary, "names">) {
	return country.names.translations?.spa?.common ?? country.names.common;
}

export function countryId(country: CountrySummary) {
	return country.codes.alpha_3 || country.uuid;
}

const compact = new Intl.NumberFormat("es", {
	maximumFractionDigits: 1,
});

export function formatPopulationShort(population = 0) {
	if (population >= 1_000_000) {
		return `${compact.format(population / 1_000_000)} M hab.`;
	}
	if (population >= 1_000) {
		return `${compact.format(population / 1_000)} mil hab.`;
	}
	return `${population} hab.`;
}

export function formatNumber(value = 0) {
	return new Intl.NumberFormat("es").format(value);
}
