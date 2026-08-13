const PALETTE = [
  "#8aa3b0",
  "#9a8f7a",
  "#7a9088",
  "#8b7d93",
  "#7d8a78",
  "#6d7370",
  "#9a8478",
  "#748392",
];

export function groupColor(group: string): string {
  let hash = 0;
  for (let i = 0; i < group.length; i += 1) {
    hash = (hash * 31 + group.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % PALETTE.length;
  return PALETTE[index] ?? PALETTE[0];
}
