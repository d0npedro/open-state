"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { datasetById, datasets } from "@/data/graphs";
import { useGraphRuntime } from "@/lib/graph/use-graph-runtime";
import { DetailPanel } from "./DetailPanel";
import { GraphCanvas } from "./GraphCanvas";
import { Toolbar } from "./Toolbar";
import "./graph-explorer.css";

export function GraphExplorer() {
  const [datasetId, setDatasetId] = useState(datasets[0].id);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [frozen, setFrozen] = useState(false);
  const [nodeLabels, setNodeLabels] = useState(true);
  const [edgeLabels, setEdgeLabels] = useState(true);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const dataset = useMemo(() => datasetById(datasetId), [datasetId]);
  const selected =
    dataset.nodes.find((node) => node.id === selectedId) ?? null;

  const switchDataset = (id: string) => {
    setDatasetId(id);
    setSearch("");
    setSelectedId(null);
  };

  const { canvasRef, reheat, fit } = useGraphRuntime(
    dataset,
    { search, selectedId, nodeLabels, edgeLabels, frozen },
    setSelectedId,
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedId(null);
        searchRef.current?.blur();
      }
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="graph-explorer">
      <Toolbar
        datasets={datasets}
        datasetId={dataset.id}
        onDataset={switchDataset}
        search={search}
        onSearch={setSearch}
        searchRef={searchRef}
        frozen={frozen}
        onFrozen={setFrozen}
        onReheat={reheat}
        onFit={fit}
        nodeLabels={nodeLabels}
        edgeLabels={edgeLabels}
        onNodeLabels={setNodeLabels}
        onEdgeLabels={setEdgeLabels}
      />
      <main id="main-content" tabIndex={-1} className="ge-stage">
        <GraphCanvas canvasRef={canvasRef} />
        <DetailPanel dataset={dataset} node={selected} />
      </main>
    </div>
  );
}
