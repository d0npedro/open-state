import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type Simulation,
  type SimulationLinkDatum,
} from "d3-force";
import type { GraphDataset, SimNode } from "./types";

export type SimLink = SimulationLinkDatum<SimNode> & {
  label?: string;
  weight?: number;
};

export type GraphSimulation = {
  simulation: Simulation<SimNode, SimLink>;
  nodes: SimNode[];
  links: SimLink[];
};

function seedLayout(count: number, index: number): { x: number; y: number } {
  const angle = (index / Math.max(count, 1)) * Math.PI * 2;
  const radius = 40 + count * 6;
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
}

export function createSimulation(dataset: GraphDataset): GraphSimulation {
  const nodes: SimNode[] = dataset.nodes.map((node, index) => {
    const seed = seedLayout(dataset.nodes.length, index);
    return { ...node, x: seed.x, y: seed.y };
  });

  const links: SimLink[] = dataset.links.map((link) => ({
    source: link.source,
    target: link.target,
    label: link.label,
    weight: link.weight,
  }));

  const simulation = forceSimulation(nodes)
    .force(
      "link",
      forceLink<SimNode, SimLink>(links)
        .id((node) => node.id)
        .distance(88)
        .strength(0.45),
    )
    .force("charge", forceManyBody().strength(-220))
    .force("center", forceCenter(0, 0))
    .force("collide", forceCollide<SimNode>(22))
    .alpha(1)
    .alphaTarget(0);

  return { simulation, nodes, links };
}

export function reheatSimulation(
  simulation: Simulation<SimNode, SimLink>,
): void {
  simulation.alphaTarget(0.3).restart();
  window.setTimeout(() => {
    simulation.alphaTarget(0);
  }, 450);
}

export function freezeSimulation(
  simulation: Simulation<SimNode, SimLink>,
): void {
  simulation.stop();
}

export function unfreezeSimulation(
  simulation: Simulation<SimNode, SimLink>,
): void {
  simulation.alpha(0.25).alphaTarget(0).restart();
}
