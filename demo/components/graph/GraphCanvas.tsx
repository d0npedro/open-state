"use client";

type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
};

export function GraphCanvas({ canvasRef }: Props) {
  return (
    <canvas
      ref={canvasRef}
      data-testid="graph-canvas"
      className="ge-canvas"
    />
  );
}
