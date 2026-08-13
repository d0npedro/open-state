import type { Camera } from "./types";

export const ZOOM_MIN = 0.15;
export const ZOOM_MAX = 6;

export function clampZoom(k: number): number {
  if (!Number.isFinite(k)) return 1;
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, k));
}

export function screenToWorld(
  camera: Camera,
  screenX: number,
  screenY: number,
): { x: number; y: number } {
  return {
    x: (screenX - camera.x) / camera.k,
    y: (screenY - camera.y) / camera.k,
  };
}

export function worldToScreen(
  camera: Camera,
  worldX: number,
  worldY: number,
): { x: number; y: number } {
  return {
    x: worldX * camera.k + camera.x,
    y: worldY * camera.k + camera.y,
  };
}

export function zoomToCursor(
  camera: Camera,
  screenX: number,
  screenY: number,
  nextK: number,
): Camera {
  const world = screenToWorld(camera, screenX, screenY);
  const k = clampZoom(nextK);
  return {
    k,
    x: screenX - world.x * k,
    y: screenY - world.y * k,
  };
}

export function panCamera(
  camera: Camera,
  dx: number,
  dy: number,
): Camera {
  return { ...camera, x: camera.x + dx, y: camera.y + dy };
}

export function fitView(
  nodes: ReadonlyArray<{ x: number; y: number }>,
  width: number,
  height: number,
  padding = 48,
): Camera {
  if (nodes.length === 0 || width <= 0 || height <= 0) {
    return { x: width / 2, y: height / 2, k: 1 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const node of nodes) {
    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x);
    maxY = Math.max(maxY, node.y);
  }

  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);
  const innerW = Math.max(width - padding * 2, 1);
  const innerH = Math.max(height - padding * 2, 1);
  const k = clampZoom(Math.min(innerW / spanX, innerH / spanY));
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  return {
    k,
    x: width / 2 - cx * k,
    y: height / 2 - cy * k,
  };
}

export function centerOn(
  camera: Camera,
  worldX: number,
  worldY: number,
  width: number,
  height: number,
): Camera {
  return {
    k: camera.k,
    x: width / 2 - worldX * camera.k,
    y: height / 2 - worldY * camera.k,
  };
}
