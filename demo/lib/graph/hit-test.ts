import type { SimNode } from "./types";

export const NODE_RADIUS = 14;
export const HIT_SLOP = 4;

export function hitTest(
  nodes: readonly SimNode[],
  worldX: number,
  worldY: number,
  radius = NODE_RADIUS + HIT_SLOP,
): SimNode | null {
  let best: SimNode | null = null;
  let bestDist = radius;
  for (const node of nodes) {
    const dx = node.x - worldX;
    const dy = node.y - worldY;
    const dist = Math.hypot(dx, dy);
    if (dist <= bestDist) {
      best = node;
      bestDist = dist;
    }
  }
  return best;
}
