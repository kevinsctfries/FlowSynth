import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useContext } from "react";
import ParameterControl from "../ParameterControl";
import { SynthContext } from "../../context/SynthContext";
import { EnvelopeModule } from "../../modules/Envelope";

import "./Node.css";

export default function EnvelopeNode(props: NodeProps) {
  const patch = useContext(SynthContext);

  const module = patch?.getModule(props.id) as EnvelopeModule | undefined;

  return (
    <div className="synth-node">
      <h3>Envelope</h3>

      {module?.parameters.map((parameter) => (
        <ParameterControl key={parameter.id} parameter={parameter} />
      ))}

      <Handle id="gate_in" type="target" position={Position.Left} />

      <Handle id="cv_out" type="source" position={Position.Right} />
    </div>
  );
}
