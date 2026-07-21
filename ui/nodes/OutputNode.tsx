import { Handle, Position } from "@xyflow/react";
import "./Node.css";

export default function OutputNode() {
  return (
    <div className="synth-node">
      <div className="node-title">Output</div>

      <div>Audio Output</div>

      <Handle id="audio_in" type="target" position={Position.Left} />
    </div>
  );
}
