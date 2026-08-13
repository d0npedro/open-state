import { NODE_RADIUS } from "./hit-test";
import { groupColor } from "./colors";
import { clampDpr } from "./dpr";
import { nodeMatchesQuery } from "./search";
import type { Camera, SimNode } from "./types";
import type { SimLink } from "./simulation";

export type RenderState = {
  nodes: SimNode[];
  links: SimLink[];
  camera: Camera;
  search: string;
  selectedId: string | null;
  hoverId: string | null;
  nodeLabels: boolean;
  edgeLabels: boolean;
  surface: string;
  text: string;
  muted: string;
  primary: string;
};

export function resizeCanvas(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
  devicePixelRatio: number,
): number {
  const dpr = clampDpr(devicePixelRatio);
  const width = Math.max(1, Math.floor(cssWidth * dpr));
  const height = Math.max(1, Math.floor(cssHeight * dpr));
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  return dpr;
}

function linkEnds(link: SimLink): { a: SimNode; b: SimNode } | null {
  const a = link.source;
  const b = link.target;
  if (typeof a === "object" && typeof b === "object") {
    return { a, b };
  }
  return null;
}

export function drawGraph(
  ctx: CanvasRenderingContext2D,
  dpr: number,
  cssWidth: number,
  cssHeight: number,
  state: RenderState,
): void {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssWidth, cssHeight);
  ctx.fillStyle = state.surface;
  ctx.fillRect(0, 0, cssWidth, cssHeight);

  const { camera } = state;
  ctx.save();
  ctx.translate(camera.x, camera.y);
  ctx.scale(camera.k, camera.k);

  const query = state.search.trim();
  const searching = query.length > 0;

  for (const link of state.links) {
    const ends = linkEnds(link);
    if (!ends) continue;
    const { a, b } = ends;
    const aHit = nodeMatchesQuery(a, state.search);
    const bHit = nodeMatchesQuery(b, state.search);
    const dim = searching && !(aHit && bHit);
    ctx.save();
    ctx.globalAlpha = dim ? 0.12 : 0.7;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = state.muted;
    ctx.lineWidth = Math.min(3, Math.max(1, link.weight ?? 1)) / camera.k;
    ctx.stroke();
    ctx.restore();
  }

  for (const node of state.nodes) {
    const hit = nodeMatchesQuery(node, state.search);
    const dim = searching && !hit;
    const selected = node.id === state.selectedId;
    const hover = node.id === state.hoverId;
    ctx.save();
    ctx.globalAlpha = dim ? 0.18 : 1;
    ctx.beginPath();
    ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = groupColor(node.group);
    ctx.fill();
    if (selected || hover) {
      ctx.lineWidth = 2 / camera.k;
      ctx.strokeStyle = state.primary;
      ctx.stroke();
    }
    ctx.restore();
  }

  const showNodeLabels =
    state.nodeLabels &&
    (camera.k >= 0.7 ||
      searching ||
      state.selectedId !== null ||
      state.nodes.length < 40);

  if (showNodeLabels) {
    ctx.font = `${12 / camera.k}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (const node of state.nodes) {
      const hit = nodeMatchesQuery(node, state.search);
      if (searching && !hit && node.id !== state.selectedId) continue;
      if (camera.k < 0.7 && !hit && node.id !== state.selectedId) continue;
      ctx.save();
      ctx.globalAlpha = searching && !hit ? 0.25 : 0.92;
      ctx.fillStyle = state.text;
      ctx.fillText(node.label, node.x, node.y + NODE_RADIUS + 4 / camera.k);
      ctx.restore();
    }
  }

  if (state.edgeLabels && camera.k >= 0.6) {
    ctx.font = `${10 / camera.k}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = state.muted;
    for (const link of state.links) {
      if (!link.label) continue;
      const ends = linkEnds(link);
      if (!ends) continue;
      const { a, b } = ends;
      const aHit = nodeMatchesQuery(a, state.search);
      const bHit = nodeMatchesQuery(b, state.search);
      if (searching && !(aHit && bHit)) continue;
      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.fillText(link.label, (a.x + b.x) / 2, (a.y + b.y) / 2);
      ctx.restore();
    }
  }

  ctx.restore();
}
