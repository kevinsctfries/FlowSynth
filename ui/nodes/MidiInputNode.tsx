import { Handle, Position } from "@xyflow/react";
import { useEffect, useState } from "react";

import "./Node.css";

type MidiDevice = {
  id: string;
  name: string;
};

type MidiInputNodeData = {
  midiModule: {
    getDevices(): MIDIInput[];

    selectDevice(id: string): void;

    initialized: boolean;

    devicesChanged: {
      subscribe(callback: (devices: MIDIInput[]) => void): () => void;
    };
  };

  synth: {
    setMode(mode: "mono" | "poly"): void;
  };
};

type Props = {
  data: MidiInputNodeData;
};

export default function MidiInputNode({ data }: Props) {
  const [devices, setDevices] = useState<MidiDevice[]>([]);

  const [mode, setMode] = useState<"mono" | "poly">("poly");

  useEffect(() => {
    const midi = data.midiModule;

    if (midi.initialized) {
      setDevices(
        midi.getDevices().map((device) => ({
          id: device.id,
          name: device.name ?? "Unknown MIDI Device",
        })),
      );
    }

    const unsubscribe = midi.devicesChanged.subscribe((devices) => {
      setDevices(
        devices.map((device) => ({
          id: device.id,
          name: device.name ?? "Unknown MIDI Device",
        })),
      );
    });

    return unsubscribe;
  }, [data.midiModule]);

  function handleDeviceChange(event: React.ChangeEvent<HTMLSelectElement>) {
    data.midiModule.selectDevice(event.target.value);
  }

  function handleModeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.value as "mono" | "poly";

    setMode(selected);

    data.synth.setMode(selected);
  }

  return (
    <div className="synth-node">
      <h3>MIDI Input</h3>

      <select onChange={handleDeviceChange}>
        <option value="">Select MIDI device</option>

        {devices.map((device) => (
          <option key={device.id} value={device.id}>
            {device.name}
          </option>
        ))}
      </select>

      <div>
        <label>
          <input
            type="radio"
            name="voice-mode"
            value="poly"
            checked={mode === "poly"}
            onChange={handleModeChange}
          />
          Poly
        </label>
      </div>

      <div>
        <label>
          <input
            type="radio"
            name="voice-mode"
            value="mono"
            checked={mode === "mono"}
            onChange={handleModeChange}
          />
          Mono
        </label>
      </div>

      <div className="handle-label pitch">
        Pitch
        <Handle id="pitch_out" type="source" position={Position.Right} />
      </div>

      <div className="handle-label velocity">
        Velocity
        <Handle id="velocity_out" type="source" position={Position.Right} />
      </div>

      <div className="handle-label gate">
        Gate
        <Handle id="gate_out" type="source" position={Position.Right} />
      </div>
    </div>
  );
}
