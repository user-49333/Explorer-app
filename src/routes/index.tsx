import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { ButtonLink } from "#/components/Button";
import Chip from "#/components/Chip";
import CountryCard from "#/components/CountryCard";
import SearchBar from "#/components/SearchBar";
import StatusMessage from "#/components/StatusMessage";
import {
	type CountriesQuery,
	getCountries,
	isRegion,
	REGIONS,
	regionLabel,
} from "#/lib/countries";

type HomeSearch = {
	q?: string;
	region?: CountriesQuery["region"];
	page?: number;
};

export const Route = createFileRoute("/")({
	validateSearch: (search: Record<string, unknown>): HomeSearch => {
		const q = typeof search.q === "string" ? search.q.trim() : "";
		const page = Number(search.page);
		return {
			q: q || undefined,
			region: isRegion(search.region) ? search.region : undefined,
			page: Number.isInteger(page) && page > 1 ? page : undefined,
		};
	},
	loaderDeps: ({ search }) => search,
	loader: ({ deps }) =>
		getCountries({
			data: { q: deps.q, region: deps.region, page: deps.page ?? 1 },
		}),
	head: ({ match }) => ({
		meta: [
			{
				title: match.search.region
					? `Países de ${regionLabel(match.search.region)} — Explorer`
					: "Explorer — Descubre países del mundo",
			},
		],
	}),
	component: Home,
});

function Home() {
	const { countries, total, pageCount } = Route.useLoaderData();
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const isLoading = useRouterState({ select: (state) => state.isLoading });
	const page = search.page ?? 1;

	const [term, setTerm] = useState(search.q ?? "");
	const chipsRef = useRef<HTMLUListElement>(null);

	// En mobile los chips hacen scroll horizontal: se mantiene visible el seleccionado
	useEffect(() => {
		const list = chipsRef.current;
		const selected = list?.querySelector<HTMLElement>(
			`[data-region="${search.region ?? "all"}"]`,
		);
		if (!list || !selected || list.scrollWidth <= list.clientWidth) return;
		list.scrollTo({
			left:
				selected.offsetLeft - list.clientWidth / 2 + selected.offsetWidth / 2,
			behavior: "smooth",
		});
	}, [search.region]);

	// Sincroniza el campo si la URL cambia desde fuera (atras/adelante, chips)
	useEffect(() => {
		setTerm((current) =>
			current.trim() === (search.q ?? "") ? current : (search.q ?? ""),
		);
	}, [search.q]);

	// Busqueda con debounce: actualiza ?q= sin llenar el historial
	useEffect(() => {
		const next = term.trim();
		if (next === (search.q ?? "")) return;
		const timeout = setTimeout(() => {
			navigate({
				search: (prev) => ({ ...prev, q: next || undefined, page: undefined }),
				replace: true,
			});
		}, 350);
		return () => clearTimeout(timeout);
	}, [term, search.q, navigate]);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		navigate({
			search: (prev) => ({
				...prev,
				q: term.trim() || undefined,
				page: undefined,
			}),
		});
	}

	const heading = search.region
		? `Países de ${regionLabel(search.region)}`
		: "Todos los países";

	return (
		<main id="contenido" className="flex-1">
			{/* Hero */}
			<section aria-labelledby="hero-title" className="bg-surface-subtle">
				<div className="mx-auto grid max-w-6xl gap-lg px-lg py-xl md:py-2xl lg:grid-cols-2 lg:items-end lg:gap-2xl">
					<div className="flex flex-col gap-sm">
						<p className="text-label text-secondary">Atlas interactivo</p>
						<h1
							id="hero-title"
							className="text-title text-text-primary lg:text-display"
						>
							Explora los países del mundo
						</h1>
						<p className="text-body text-text-secondary">
							Busca por nombre o capital y filtra por región para conocer
							banderas, población, idiomas y más.
						</p>
					</div>
					<search>
						<form onSubmit={handleSubmit}>
							<SearchBar value={term} onChange={setTerm} />
						</form>
					</search>
				</div>
			</section>

			<div className="mx-auto grid max-w-6xl grid-cols-1 gap-lg px-lg py-lg md:py-xl lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-2xl">
				{/* Filtros por region */}
				<aside
					aria-labelledby="filtros-title"
					className="min-w-0 lg:sticky lg:top-28 lg:self-start"
				>
					<h2 id="filtros-title" className="mb-sm text-card text-text-primary">
						Región
					</h2>
					<nav aria-label="Filtrar por región">
						<ul
							ref={chipsRef}
							className="-mx-lg flex gap-sm overflow-x-auto px-lg pb-xs [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 lg:flex-col lg:items-start"
						>
							<li>
								<Chip
									to="/"
									search={(prev) => ({
										...prev,
										region: undefined,
										page: undefined,
									})}
									data-region="all"
									selected={!search.region}
								>
									Todas
								</Chip>
							</li>
							{REGIONS.map((region) => (
								<li key={region.value}>
									<Chip
										to="/"
										search={(prev) => ({
											...prev,
											region: region.value,
											page: undefined,
										})}
										data-region={region.value}
										selected={search.region === region.value}
									>
										{region.label}
									</Chip>
								</li>
							))}
						</ul>
					</nav>
				</aside>

				{/* Resultados */}
				<section
					aria-labelledby="resultados-title"
					aria-busy={isLoading}
					className="flex min-w-0 flex-col gap-md"
				>
					<header className="flex flex-wrap items-end justify-between gap-sm">
						<div className="flex flex-col gap-xs">
							<h2 id="resultados-title" className="text-card text-text-primary">
								{heading}
							</h2>
							<p className="text-label text-text-secondary" aria-live="polite">
								{total} {total === 1 ? "resultado" : "resultados"}
								{search.q ? ` para “${search.q}”` : ""}
							</p>
						</div>
						{isLoading && (
							<span className="loading loading-spinner loading-sm text-primary" />
						)}
					</header>

					{countries.length === 0 ? (
						<StatusMessage
							title="Sin resultados"
							description="No encontramos países con esa búsqueda. Prueba con otro nombre, una capital o cambia la región."
						/>
					) : (
						<ul
							className={`grid grid-cols-1 gap-md transition-opacity md:grid-cols-2 2xl:grid-cols-3 ${isLoading ? "opacity-60" : ""}`}
						>
							{countries.map((country) => (
								<li key={country.uuid}>
									<CountryCard country={country} />
								</li>
							))}
						</ul>
					)}

					{pageCount > 1 && (
						<nav
							aria-label="Paginación"
							className="mt-sm flex flex-wrap items-center justify-between gap-sm border-t border-border pt-md"
						>
							<ButtonLink
								to="/"
								search={(prev) => ({
									...prev,
									page: page - 1 > 1 ? page - 1 : undefined,
								})}
								variant="outline"
								disabled={page <= 1}
								className="flex-1 sm:flex-none"
							>
								Anterior
							</ButtonLink>
							<p className="order-first w-full text-center text-label text-text-secondary sm:order-none sm:w-auto">
								Página {page} de {pageCount}
							</p>
							<ButtonLink
								to="/"
								search={(prev) => ({ ...prev, page: page + 1 })}
								disabled={page >= pageCount}
								className="flex-1 sm:flex-none"
							>
								Siguiente
							</ButtonLink>
						</nav>
					)}
				</section>
			</div>
		</main>
	);
}
