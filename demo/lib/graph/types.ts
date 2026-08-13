export type GraphNode = {
  id: string;
  label: string;
  group: string;
  description?: string;
  meta?: Record<string, string | number | boolean>;
};

export type GraphLink = {
  source: string;
  target: string;
  label?: string;
  weight?: number;
};

export type GraphDataset = {
  id: string;
  title: string;
  description: string;
  nodes: GraphNode[];
  links: GraphLink[];
};

export type SimNode = GraphNode & {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
};

export type Camera = {
  x: number;
  y: number;
  k: number;
};

export type DatasetIssue = {
  code: "duplicate-id" | "missing-endpoint" | "blank-id";
  message: string;
};

export type DatasetValidation = {
  ok: boolean;
  issues: DatasetIssue[];
};

export type Neighbor = {
  id: string;
  label: string;
  linkLabel?: string;
  direction: "out" | "in";
};
