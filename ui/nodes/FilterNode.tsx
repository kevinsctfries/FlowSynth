import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useContext, useState } from "react";
import { SynthContext } from "../../audio/SynthContext";
import { FilterModule } from "../../audio/modules/Filter";
import Knob from "../Knob";
import "./Node.css";

export default function FilterNode(props: NodeProps) {
  const patch = useContext(SynthContext);

  const module = patch?.getModule(props.id) as FilterModule;

  const [cutoff, setCutoff] = useState(1000);

  const [resonance, setResonance] = useState(1);

  const [type, setType] = useState<BiquadFilterType>("lowpass");

  function changeCutoff(value: number) {
    setCutoff(value);

    module?.setCutoff(value);
  }

  function changeResonance(value: number) {
    setResonance(value);

    module?.setResonance(value);
  }

  function changeType(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value as BiquadFilterType;

    setType(value);

    module?.setType(value);
  }

  return (
    <div className="synth-node">
      <h3>Filter</h3>

      <label>Type</label>

      <select
        className="nodrag"
        value={type}
        onChange={changeType}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <option value="lowpass">Low Pass</option>

        <option value="highpass">High Pass</option>

        <option value="bandpass">Band Pass</option>

        <option value="notch">Notch</option>
      </select>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "15px",
        }}
      >
        <Knob
          value={cutoff}
          min={20}
          max={20000}
          step={10}
          onChange={changeCutoff}
        />

        <Knob
          value={resonance}
          min={0}
          max={20}
          step={0.1}
          onChange={changeResonance}
        />
      </div>

      <div>
        Cutoff: {Math.round(cutoff)}
        Hz
      </div>

      <div>Resonance: {resonance.toFixed(1)}</div>

      <Handle type="target" position={Position.Left} />

      <Handle type="source" position={Position.Right} />
    </div>
  );
}
