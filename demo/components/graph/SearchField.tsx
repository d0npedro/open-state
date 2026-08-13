"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export function SearchField({ value, onChange, inputRef }: Props) {
  return (
    <label className="ge-search-label">
      <span className="sr-only">Suche</span>
      <input
        ref={inputRef}
        data-testid="graph-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Suche"
        className="ge-search"
      />
    </label>
  );
}
