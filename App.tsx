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
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useEffect, useState, useRef } from "react";

import { AudioEngine } from "./engine/AudioEngine";

import { Patch } from "./engine/Patch";

import { SynthContext } from "./context/SynthContext";

import OscillatorNode from "./ui/nodes/OscillatorNode";
import OutputNode from "./ui/nodes/OutputNode";
import GainNode from "./ui/nodes/GainNode";
import FilterNode from "./ui/nodes/FilterNode";
import ModulePanel from "./ui/ModulePanel";
import EnvelopeNode from "./ui/nodes/EnvelopeNode";
import GateInputNode from "./ui/nodes/GateInputNode";

const nodeTypes = {
  oscillator: OscillatorNode,
  gain: GainNode,
  filter: FilterNode,
  output: OutputNode,
  envelope: EnvelopeNode,
  gate: GateInputNode,
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

  function onNodesChange(changes: NodeChange[]) {
    setNodes((current) => applyNodeChanges(changes, current));
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

        data: {},
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
