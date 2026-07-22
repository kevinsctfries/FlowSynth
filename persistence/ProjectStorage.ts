import type { Node, Edge } from "@xyflow/react";

export type SavedModule = {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
};

export type SavedConnection = {
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
};

export type ProjectData = {
  modules: SavedModule[];
  connections: SavedConnection[];
};

const STORAGE_KEY = "synth-project";

export class ProjectStorage {
  static save(nodes: Node[], edges: Edge[]) {
    const data: ProjectData = {
      modules: nodes.map((node) => ({
        id: node.id,
        type: node.type!,
        position: node.position,
      })),

      connections: edges.map((edge) => ({
        source: edge.source,
        sourceHandle: edge.sourceHandle!,
        target: edge.target,
        targetHandle: edge.targetHandle!,
      })),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  static load(): ProjectData | null {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return null;
    }

    return JSON.parse(saved);
  }

  static clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
}
