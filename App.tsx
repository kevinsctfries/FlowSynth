import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type Connection,
  addEdge,
  applyNodeChanges,
  type NodeChange,
  type NodeMouseHandler,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useEffect, useState, useRef } from "react";

import { AudioEngine } from "./engine/AudioEngine";
import { Patch } from "./engine/Patch";

import { SynthContext } from "./context/SynthContext";

import OscillatorNode from "./ui/nodes/OscillatorNode";
import OutputNode from "./ui/nodes/OutputNode";
import VCANode from "./ui/nodes/VCANode";
import FilterNode from "./ui/nodes/FilterNode";
import ModulePanel from "./ui/ModulePanel";
import EnvelopeNode from "./ui/nodes/EnvelopeNode";
import GateInputNode from "./ui/nodes/GateInputNode";
import MidiInputNode from "./ui/nodes/MidiInputNode";

import { ProjectStorage } from "./persistence/ProjectStorage";

const nodeTypes = {
  oscillator: OscillatorNode,
  vca: VCANode,
  filter: FilterNode,
  output: OutputNode,
  envelope: EnvelopeNode,
  gate: GateInputNode,
  midi: MidiInputNode,
};

export default function App() {
  const engineRef = useRef<AudioEngine | null>(null);

  const patchRef = useRef<Patch | null>(null);

  if (!engineRef.current) {
    engineRef.current = new AudioEngine();
  }

  if (!patchRef.current) {
    patchRef.current = new Patch(engineRef.current);
  }

  const engine = engineRef.current;
  const patch = patchRef.current;

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const unlockAudio = async () => {
      await engine.start();
      console.log("Audio unlocked");
    };

    window.addEventListener("click", unlockAudio, {
      once: true,
    });

    return () => {
      window.removeEventListener("click", unlockAudio);
    };
  }, [engine]);

  useEffect(() => {
    const saved = ProjectStorage.load();

    if (saved) {
      const restoredNodes: Node[] = [];

      for (const module of saved.modules) {
        const created = patch.createModule(module.type, module.id);

        restoredNodes.push({
          id: created.id,

          type: module.type,

          position: module.position,

          data: {
            midiModule: created.type === "midi" ? created : undefined,

            patch,
          },
        });
      }

      for (const connection of saved.connections) {
        patch.connect(
          connection.source,

          connection.sourceHandle,

          connection.target,

          connection.targetHandle,
        );
      }

      setNodes(restoredNodes);

      setEdges(
        saved.connections.map((connection, index) => ({
          id: `edge-${index}`,

          source: connection.source,

          sourceHandle: connection.sourceHandle,

          target: connection.target,

          targetHandle: connection.targetHandle,
        })),
      );

      return;
    }

    const midi = patch.createModule("midi");

    setNodes([
      {
        id: midi.id,

        type: "midi",

        position: {
          x: 100,
          y: 100,
        },

        data: {
          midiModule: midi,
          patch,
        },
      },
    ]);
  }, [patch]);

  useEffect(() => {
    if (nodes.length > 0) {
      ProjectStorage.save(nodes, edges);
    }
  }, [nodes, edges]);

  function onNodesChange(changes: NodeChange[]) {
    setNodes((current) => applyNodeChanges(changes, current));
  }

  function onNodesDelete(deletedNodes: Node[]) {
    const ids = deletedNodes.map((node) => node.id);

    for (const id of ids) {
      patch.removeModule(id);
    }

    setEdges((current) =>
      current.filter(
        (edge) => !ids.includes(edge.source) && !ids.includes(edge.target),
      ),
    );
  }

  function addModule(type: string) {
    const result = patch.createModule(type);

    setNodes((current) => [
      ...current,

      {
        id: result.id,

        type,

        position: {
          x: Math.random() * 500,

          y: Math.random() * 400,
        },

        data: {
          midiModule: result.type === "midi" ? result : undefined,

          patch,
        },
      },
    ]);
  }

  function onConnect(connection: Connection) {
    if (!connection.source || !connection.target) {
      return;
    }

    patch.connect(
      connection.source,

      connection.sourceHandle!,

      connection.target,

      connection.targetHandle!,
    );

    setEdges((current) => addEdge(connection, current));
  }

  function onEdgesDelete(deletedEdges: Edge[]) {
    for (const edge of deletedEdges) {
      const connection = patch
        .getConnections()
        .find(
          (connection) =>
            connection.sourceModuleId === edge.source &&
            connection.destinationModuleId === edge.target &&
            connection.source.id === edge.sourceHandle &&
            connection.destination.id === edge.targetHandle,
        );

      if (connection) {
        patch.disconnect(connection);
      }
    }
  }

  return (
    <SynthContext.Provider value={patch}>
      <div
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
        <ModulePanel onAddModule={addModule} />

        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesDelete={onEdgesDelete}
          onNodesDelete={onNodesDelete}
          onConnect={onConnect}
          fitView
        >
          <Background />

          <Controls />
        </ReactFlow>
      </div>
    </SynthContext.Provider>
  );
}
