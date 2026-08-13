"use client";

import { neighborsOf } from "@/lib/graph/search";
import type { GraphDataset, GraphNode } from "@/lib/graph/types";

type Props = {
  dataset: GraphDataset;
  node: GraphNode | null;
};

export function DetailPanel({ dataset, node }: Props) {
  if (!node) {
    return (
      <aside data-testid="graph-panel" className="ge-panel ge-panel-empty">
        Knoten wählen
      </aside>
    );
  }

  const neighbors = neighborsOf(node.id, dataset.nodes, dataset.links);
  const meta = node.meta ? Object.entries(node.meta) : [];

  return (
    <aside data-testid="graph-panel" className="ge-panel">
      <p className="ge-kicker">{node.group}</p>
      <h2 className="ge-title">{node.label}</h2>
      {node.description ? <p className="ge-desc">{node.description}</p> : null}
      {meta.length > 0 ? (
        <dl className="ge-meta">
          {meta.map(([key, value]) => (
            <div key={key} className="ge-meta-row">
              <dt>{key}</dt>
              <dd>{String(value)}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <h3 className="ge-neighbors-title">Nachbarn</h3>
      {neighbors.length === 0 ? (
        <p className="ge-desc">Keine</p>
      ) : (
        <ul className="ge-neighbors">
          {neighbors.map((neighbor) => (
            <li key={`${neighbor.direction}-${neighbor.id}`}>
              <span className="ge-dir">
                {neighbor.direction === "out" ? "zu" : "von"}
              </span>{" "}
              {neighbor.label}
              {neighbor.linkLabel ? (
                <span className="ge-link-label"> · {neighbor.linkLabel}</span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
