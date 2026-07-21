import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useContext } from "react";
import ParameterControl from "../ParameterControl";
import { SynthContext } from "../../context/SynthContext";
import { GainModule } from "../../modules/Gain";

import "./Node.css";

export default function GainNode(props: NodeProps) {
  const patch = useContext(SynthContext);

  const module = patch?.getModule(props.id) as GainModule | undefined;

  return (
    <div className="synth-node">
      <h3>Gain</h3>

      {module?.parameters.map((parameter) => (
        <ParameterControl key={parameter.id} parameter={parameter} />
      ))}

      <Handle type="target" position={Position.Left} />

      <Handle type="source" position={Position.Right} />
    </div>
  );
}
