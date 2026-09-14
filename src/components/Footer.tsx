export default function Footer() {
	return (
		<footer className="border-t border-border bg-surface">
			<div className="mx-auto flex max-w-6xl flex-col gap-xs px-lg py-lg text-label text-text-secondary md:flex-row md:items-center md:justify-between">
				<p>Explorer · Primer Examen Parcial de Diseño Web</p>
				<p>
					Datos de{" "}
					<a
						href="https://restcountries.com"
						target="_blank"
						rel="noreferrer"
						className="text-primary underline-offset-4 hover:underline"
					>
						REST Countries
					</a>
				</p>
			</div>
		</footer>
	);
}
