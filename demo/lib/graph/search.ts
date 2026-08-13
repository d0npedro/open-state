import type { GraphLink, GraphNode, Neighbor } from "./types";

export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function nodeMatchesQuery(node: GraphNode, query: string): boolean {
  const q = normalizeQuery(query);
  if (!q) return true;
  const hay = [node.id, node.label, node.group, node.description ?? ""];
  return hay.some((part) => part.toLowerCase().includes(q));
}

export function neighborsOf(
  nodeId: string,
  nodes: GraphNode[],
  links: GraphLink[],
): Neighbor[] {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const found: Neighbor[] = [];

  for (const link of links) {
    if (link.source === nodeId) {
      const other = byId.get(link.target);
      if (other) {
        found.push({
          id: other.id,
          label: other.label,
          linkLabel: link.label,
          direction: "out",
        });
      }
    } else if (link.target === nodeId) {
      const other = byId.get(link.source);
      if (other) {
        found.push({
          id: other.id,
          label: other.label,
          linkLabel: link.label,
          direction: "in",
        });
      }
    }
  }

  return found;
}
