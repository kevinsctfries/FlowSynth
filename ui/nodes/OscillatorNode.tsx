import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useContext } from "react";
import ParameterControl from "../ParameterControl";
import { SynthContext } from "../../context/SynthContext";
import { OscillatorModule } from "../../modules/Oscillator";

import "./Node.css";

export default function OscillatorNode(props: NodeProps) {
  const patch = useContext(SynthContext);

  const module = patch?.getModule(props.id) as OscillatorModule | undefined;

  return (
    <div className="synth-node">
      <h3>Oscillator</h3>

      {module?.parameters.map((parameter) => (
        <ParameterControl key={parameter.id} parameter={parameter} />
      ))}

      <Handle type="target" position={Position.Left} id="pitch_cv" />

      <Handle id="audio_out" type="source" position={Position.Right} />
    </div>
  );
}
