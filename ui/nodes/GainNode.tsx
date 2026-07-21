import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useContext, useState } from "react";
import { SynthContext } from "../../context/SynthContext";
import { GainModule } from "../../modules/Gain";
import Knob from "../Knob";

import "./Node.css";

export default function GainNode(props: NodeProps) {
  const patch = useContext(SynthContext);

  const module = patch?.getModule(props.id) as GainModule;

  const [volume, setVolume] = useState(0.5);

  function updateVolume(value: number) {
    setVolume(value);

    module?.setGain(value);
  }

  return (
    <div className="synth-node">
      <h3>Gain</h3>

      <Knob
        value={volume}
        min={0}
        max={1}
        step={0.01}
        onChange={updateVolume}
      />

      <div>{volume.toFixed(2)}</div>

      <Handle type="target" position={Position.Left} />

      <Handle type="source" position={Position.Right} />
    </div>
  );
}
