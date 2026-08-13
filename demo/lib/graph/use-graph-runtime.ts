import { useEffect, useRef } from "react";
import {
  centerOn,
  fitView,
  panCamera,
  screenToWorld,
  zoomToCursor,
} from "./camera";
import { hitTest } from "./hit-test";
import { applyNodeDrag, applyNodeRelease } from "./pin";
import { drawGraph, resizeCanvas } from "./render";
import {
  createSimulation,
  freezeSimulation,
  reheatSimulation,
  unfreezeSimulation,
  type GraphSimulation,
} from "./simulation";
import type { Camera, GraphDataset, SimNode } from "./types";

export type RuntimeFlags = {
  search: string;
  selectedId: string | null;
  nodeLabels: boolean;
  edgeLabels: boolean;
  frozen: boolean;
};

export type RuntimeApi = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  reheat: () => void;
  fit: () => void;
};

const CLICK_SLOP = 4;

function readToken(
  el: Element,
  name: string,
  fallback: string,
): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(el).getPropertyValue(name).trim();
  return value || fallback;
}

export function useGraphRuntime(
  dataset: GraphDataset,
  flags: RuntimeFlags,
  onSelect: (id: string | null) => void,
): RuntimeApi {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const flagsRef = useRef(flags);
  flagsRef.current = flags;
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  const engineRef = useRef<GraphSimulation | null>(null);
  const cameraRef = useRef<Camera>({ x: 0, y: 0, k: 1 });
  const dirtyRef = useRef(true);
  const interactingRef = useRef(false);
  const hoverIdRef = useRef<string | null>(null);
  const dragRef = useRef<{
    kind: "node" | "pan" | "pending";
    node: SimNode | null;
    lastX: number;
    lastY: number;
    startX: number;
    startY: number;
    pointerId: number;
  } | null>(null);

  const reheat = () => {
    const engine = engineRef.current;
    if (!engine || flagsRef.current.frozen) return;
    reheatSimulation(engine.simulation);
    dirtyRef.current = true;
  };

  const fit = () => {
    const canvas = canvasRef.current;
    const engine = engineRef.current;
    if (!canvas || !engine) return;
    const rect = canvas.getBoundingClientRect();
    cameraRef.current = fitView(engine.nodes, rect.width, rect.height);
    dirtyRef.current = true;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = createSimulation(dataset);
    engineRef.current = engine;
    engine.simulation.on("tick", () => {
      dirtyRef.current = true;
    });

    const rect = canvas.getBoundingClientRect();
    cameraRef.current = fitView(engine.nodes, rect.width, rect.height);
    dirtyRef.current = true;

    if (flagsRef.current.frozen) {
      freezeSimulation(engine.simulation);
    }

    return () => {
      engine.simulation.on("tick", null);
      engine.simulation.stop();
      if (engineRef.current === engine) engineRef.current = null;
    };
  }, [dataset]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (flags.frozen) freezeSimulation(engine.simulation);
    else unfreezeSimulation(engine.simulation);
    dirtyRef.current = true;
  }, [flags.frozen]);

  useEffect(() => {
    dirtyRef.current = true;
  }, [flags.search, flags.selectedId, flags.nodeLabels, flags.edgeLabels]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;

    const measure = () => {
      const host = canvas.parentElement ?? canvas;
      return host.getBoundingClientRect();
    };

    const paint = () => {
      const engine = engineRef.current;
      if (!engine) return;
      const rect = measure();
      const dpr = resizeCanvas(
        canvas,
        rect.width,
        rect.height,
        window.devicePixelRatio || 1,
      );
      const flagsNow = flagsRef.current;
      const tokenRoot = canvas.closest(".graph-explorer") ?? canvas;
      drawGraph(ctx, dpr, rect.width, rect.height, {
        nodes: engine.nodes,
        links: engine.links,
        camera: cameraRef.current,
        search: flagsNow.search,
        selectedId: flagsNow.selectedId,
        hoverId: hoverIdRef.current,
        nodeLabels: flagsNow.nodeLabels,
        edgeLabels: flagsNow.edgeLabels,
        surface: readToken(tokenRoot, "--color-surface", "#121417"),
        text: readToken(tokenRoot, "--color-ink", "#d7d9d6"),
        muted: readToken(tokenRoot, "--color-muted", "#8b908c"),
        primary: readToken(tokenRoot, "--color-primary", "#7dd3c0"),
      });
    };

    const loop = () => {
      if (!running) return;
      raf = window.requestAnimationFrame(loop);
      if (!dirtyRef.current && !interactingRef.current) return;
      paint();
      dirtyRef.current = false;
    };
    raf = window.requestAnimationFrame(loop);

    const onResize = () => {
      dirtyRef.current = true;
    };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [dataset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const localPoint = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const engine = engineRef.current;
      if (!engine) return;
      const local = localPoint(event);
      const world = screenToWorld(cameraRef.current, local.x, local.y);
      const node = hitTest(engine.nodes, world.x, world.y);
      dragRef.current = {
        kind: "pending",
        node,
        lastX: local.x,
        lastY: local.y,
        startX: local.x,
        startY: local.y,
        pointerId: event.pointerId,
      };
      interactingRef.current = true;
      canvas.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      const engine = engineRef.current;
      if (!engine) return;
      const local = localPoint(event);
      const drag = dragRef.current;

      if (!drag) {
        const world = screenToWorld(cameraRef.current, local.x, local.y);
        const hover = hitTest(engine.nodes, world.x, world.y);
        const nextId = hover?.id ?? null;
        if (hoverIdRef.current !== nextId) {
          hoverIdRef.current = nextId;
          dirtyRef.current = true;
        }
        return;
      }

      const dx = local.x - drag.lastX;
      const dy = local.y - drag.lastY;
      const moved =
        Math.hypot(local.x - drag.startX, local.y - drag.startY) > CLICK_SLOP;

      if (drag.kind === "pending" && moved) {
        drag.kind = drag.node ? "node" : "pan";
      }

      if (drag.kind === "node" && drag.node) {
        const world = screenToWorld(cameraRef.current, local.x, local.y);
        applyNodeDrag(drag.node, world.x, world.y);
        if (!flagsRef.current.frozen) {
          engine.simulation.alphaTarget(0.2).restart();
        }
        dirtyRef.current = true;
      } else if (drag.kind === "pan") {
        cameraRef.current = panCamera(cameraRef.current, dx, dy);
        dirtyRef.current = true;
      }

      drag.lastX = local.x;
      drag.lastY = local.y;
    };

    const endDrag = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const engine = engineRef.current;
      const moved =
        Math.hypot(eventHasLocal(event, canvas).x - drag.startX, eventHasLocal(event, canvas).y - drag.startY) >
        CLICK_SLOP;

      if (drag.kind === "node" && drag.node) {
        applyNodeRelease(drag.node, flagsRef.current.frozen);
        if (!flagsRef.current.frozen) {
          engine?.simulation.alphaTarget(0);
        }
      } else if (drag.kind === "pending" && !moved) {
        selectRef.current(drag.node?.id ?? null);
      }

      dragRef.current = null;
      interactingRef.current = false;
      dirtyRef.current = true;
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const sx = event.clientX - rect.left;
      const sy = event.clientY - rect.top;
      const factor = event.deltaY < 0 ? 1.08 : 1 / 1.08;
      cameraRef.current = zoomToCursor(
        cameraRef.current,
        sx,
        sy,
        cameraRef.current.k * factor,
      );
      dirtyRef.current = true;
    };

    const onDblClick = (event: MouseEvent) => {
      const engine = engineRef.current;
      if (!engine) return;
      const rect = canvas.getBoundingClientRect();
      const local = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      const world = screenToWorld(cameraRef.current, local.x, local.y);
      const node = hitTest(engine.nodes, world.x, world.y);
      if (node) {
        cameraRef.current = centerOn(
          cameraRef.current,
          node.x,
          node.y,
          rect.width,
          rect.height,
        );
      } else {
        cameraRef.current = fitView(engine.nodes, rect.width, rect.height);
      }
      dirtyRef.current = true;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("dblclick", onDblClick);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("dblclick", onDblClick);
    };
  }, [dataset]);

  return { canvasRef, reheat, fit };
}

function eventHasLocal(event: PointerEvent, canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}
