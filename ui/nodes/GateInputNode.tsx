import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useContext } from "react";
import { SynthContext } from "../../context/SynthContext";
import { GateInputModule } from "../../modules/GateInput";

import "./Node.css";

export default function GateInputNode(props: NodeProps) {
  const patch = useContext(SynthContext);

  const module = patch?.getModule(props.id) as GateInputModule | undefined;

  return (
    <div className="synth-node">
      <h3>Gate Input</h3>

      <button
        onPointerDown={() => module?.noteOn()}
        onPointerUp={() => module?.noteOff()}
        onPointerCancel={() => module?.noteOff()}
        onBlur={() => module?.noteOff()}
      >
        {module?.isGateOpen() ? "Gate ON" : "Test Gate"}
      </button>

      <Handle id="gate_out" type="source" position={Position.Right} />
    </div>
  );
}
