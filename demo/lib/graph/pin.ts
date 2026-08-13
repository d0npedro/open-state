export type Pinnable = {
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
};

export function applyNodeDrag(node: Pinnable, x: number, y: number): void {
  node.x = x;
  node.y = y;
  node.fx = x;
  node.fy = y;
}

export function applyNodeRelease(node: Pinnable, frozen: boolean): void {
  if (frozen) return;
  node.fx = null;
  node.fy = null;
}

export function isPinned(node: Pinnable): boolean {
  return node.fx != null || node.fy != null;
}
