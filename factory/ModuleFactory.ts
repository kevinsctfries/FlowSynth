import { AudioEngine } from "../engine/AudioEngine";
import { Module } from "../engine/Module";
import { OscillatorModule } from "../modules/Oscillator";
import { OutputModule } from "../modules/Output";
import { VCAModule } from "../modules/VCA";
import { FilterModule } from "../modules/Filter";
import { EnvelopeModule } from "../modules/Envelope";
import { GateInputModule } from "../modules/GateInput";

export function createModule(
  type: string,
  id: string,
  engine: AudioEngine,
): Module {
  switch (type) {
    case "oscillator":
      return new OscillatorModule(id, engine.context);
    case "vca":
      return new VCAModule(id, engine.context);
    case "output":
      return new OutputModule(id, engine.context);
    case "filter":
      return new FilterModule(id, engine.context);
    case "envelope":
      return new EnvelopeModule(id, engine.context);
    case "gate":
      return new GateInputModule(id);
    default:
      throw new Error(`Unknown module type ${type}`);
  }
}
