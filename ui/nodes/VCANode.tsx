import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useContext } from "react";
import ParameterControl from "../ParameterControl";
import { SynthContext } from "../../context/SynthContext";
import { VCAModule } from "../../modules/VCA";

import "./Node.css";

export default function VCANode(props: NodeProps) {
  const patch = useContext(SynthContext);

  const module = patch?.getModule(props.id) as VCAModule | undefined;

  return (
    <div className="synth-node">
      <h3>VCA</h3>

      {module?.parameters.map((parameter) => (
        <ParameterControl key={parameter.id} parameter={parameter} />
      ))}

      <Handle id="audio_in" type="target" position={Position.Left} />

      <Handle id="audio_out" type="source" position={Position.Right} />

      <Handle id="cv_in" type="target" position={Position.Top} />
    </div>
  );
}
