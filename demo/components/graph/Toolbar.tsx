"use client";

import Link from "next/link";
import { SearchField } from "./SearchField";
import type { GraphDataset } from "@/lib/graph/types";

type Props = {
  datasets: GraphDataset[];
  datasetId: string;
  onDataset: (id: string) => void;
  search: string;
  onSearch: (value: string) => void;
  searchRef: React.RefObject<HTMLInputElement>;
  frozen: boolean;
  onFrozen: (value: boolean) => void;
  onReheat: () => void;
  onFit: () => void;
  nodeLabels: boolean;
  edgeLabels: boolean;
  onNodeLabels: (value: boolean) => void;
  onEdgeLabels: (value: boolean) => void;
};

export function Toolbar({
  datasets,
  datasetId,
  onDataset,
  search,
  onSearch,
  searchRef,
  frozen,
  onFrozen,
  onReheat,
  onFit,
  nodeLabels,
  edgeLabels,
  onNodeLabels,
  onEdgeLabels,
}: Props) {
  return (
    <header className="ge-toolbar">
      <Link href="/" className="ge-home">
        Open State
      </Link>
      <select
        data-testid="graph-select"
        aria-label="Graph"
        value={datasetId}
        onChange={(event) => onDataset(event.target.value)}
        className="ge-select"
      >
        {datasets.map((dataset) => (
          <option key={dataset.id} value={dataset.id}>
            {dataset.title}
          </option>
        ))}
      </select>
      <SearchField value={search} onChange={onSearch} inputRef={searchRef} />
      <button type="button" className="ge-btn" onClick={onReheat}>
        Aufheizen
      </button>
      <button
        type="button"
        className={frozen ? "ge-btn ge-btn-on" : "ge-btn"}
        aria-pressed={frozen}
        onClick={() => onFrozen(!frozen)}
      >
        {frozen ? "Eingefroren" : "Einfrieren"}
      </button>
      <button type="button" className="ge-btn" onClick={onFit}>
        Einpassen
      </button>
      <button
        type="button"
        className={nodeLabels ? "ge-btn ge-btn-on" : "ge-btn"}
        aria-pressed={nodeLabels}
        onClick={() => onNodeLabels(!nodeLabels)}
      >
        Knotenlabels
      </button>
      <button
        type="button"
        className={edgeLabels ? "ge-btn ge-btn-on" : "ge-btn"}
        aria-pressed={edgeLabels}
        onClick={() => onEdgeLabels(!edgeLabels)}
      >
        Kantenlabels
      </button>
    </header>
  );
}
