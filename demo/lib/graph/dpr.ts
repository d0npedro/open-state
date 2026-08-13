export const DPR_MAX = 2;

export function clampDpr(devicePixelRatio: number): number {
  const raw = Number.isFinite(devicePixelRatio) ? devicePixelRatio : 1;
  return Math.min(Math.max(raw, 1), DPR_MAX);
}
