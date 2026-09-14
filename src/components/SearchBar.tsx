import searchIcon from "#/assets/icons/search.svg";
import Icon from "./Icon";

type SearchBarProps = {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
};

/** Barra de busqueda (Figma 6:2) sobre el componente input de daisyUI */
export default function SearchBar({
	value,
	onChange,
	placeholder = "Buscar país o capital",
}: SearchBarProps) {
	return (
		<label className="input h-control w-full gap-sm rounded-md border-border bg-surface px-md shadow-none [--input-color:var(--color-focus)]">
			<Icon src={searchIcon} className="size-6 text-text-secondary" />
			<span className="sr-only">Buscar país o capital</span>
			<input
				type="search"
				name="q"
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
				autoComplete="off"
				className="text-body text-text-primary placeholder:text-text-secondary"
			/>
		</label>
	);
}
