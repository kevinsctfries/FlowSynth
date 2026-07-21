import { Handle, Position, type NodeProps } from "@xyflow/react";

import { useContext, useState } from "react";

import { SynthContext } from "../../context/SynthContext";

import { OscillatorModule } from "../../modules/Oscillator";

import Knob from "../Knob";

import "./Node.css";

export default function OscillatorNode(props: NodeProps) {
  const patch = useContext(SynthContext);

  const module = patch?.getModule(props.id) as OscillatorModule;

  const [frequency, setFrequency] = useState(440);

  const [wave, setWave] = useState<OscillatorType>("sawtooth");

  function changeFrequency(value: number) {
    setFrequency(value);

    module?.setFrequency(value);
  }

  function changeWave(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value as OscillatorType;

    setWave(value);

    module?.setWaveform(value);
  }

  return (
    <div className="synth-node">
      <h3>Oscillator</h3>

      <label>Waveform</label>

      <select
        className="nodrag"
        value={wave}
        onChange={changeWave}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <option value="sine">Sine</option>

        <option value="square">Square</option>

        <option value="sawtooth">Saw</option>

        <option value="triangle">Triangle</option>
      </select>

      <Knob
        value={frequency}
        min={20}
        max={2000}
        step={1}
        onChange={changeFrequency}
      />

      <div>{frequency} Hz</div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
}
