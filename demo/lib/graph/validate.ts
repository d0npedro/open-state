import type { DatasetValidation, GraphDataset } from "./types";

export function validateDataset(dataset: GraphDataset): DatasetValidation {
  const issues: DatasetValidation["issues"] = [];
  const seen = new Set<string>();

  for (const node of dataset.nodes) {
    if (!node.id || /\s/.test(node.id)) {
      issues.push({
        code: "blank-id",
        message: `Node id is blank or contains whitespace: "${node.id}"`,
      });
    }
    if (seen.has(node.id)) {
      issues.push({
        code: "duplicate-id",
        message: `Duplicate node id: "${node.id}"`,
      });
    }
    seen.add(node.id);
  }

  for (const link of dataset.links) {
    if (!seen.has(link.source)) {
      issues.push({
        code: "missing-endpoint",
        message: `Link source "${link.source}" is not a node`,
      });
    }
    if (!seen.has(link.target)) {
      issues.push({
        code: "missing-endpoint",
        message: `Link target "${link.target}" is not a node`,
      });
    }
  }

  return { ok: issues.length === 0, issues };
}
