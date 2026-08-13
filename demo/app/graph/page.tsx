import type { Metadata } from "next";
import { GraphExplorer } from "@/components/graph/GraphExplorer";

export const metadata: Metadata = {
  title: "Netzwerkgraph – Open State",
  description:
    "Fach-, Modul- und Datenmodellgraph der Open-State-Demo. Statische Daten, kein Backend.",
};

export default function GraphPage() {
  return <GraphExplorer />;
}
