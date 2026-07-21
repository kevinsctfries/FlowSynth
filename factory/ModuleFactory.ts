import { AudioEngine } from "../engine/AudioEngine";

import { Module } from "../engine/Module";

import { OscillatorModule } from "../modules/Oscillator";

import { OutputModule } from "../modules/Output";

import { GainModule } from "../modules/Gain";

import { FilterModule } from "../modules/Filter";

export function createModule(
  type: string,
  id: string,
  engine: AudioEngine,
): Module {
  switch (type) {
    case "oscillator":
      return new OscillatorModule(id, engine.context);

    case "gain":
      return new GainModule(id, engine.context);

    case "output":
      return new OutputModule(id, engine.context);

    case "filter":
      return new FilterModule(id, engine.context);

    default:
      throw new Error(`Unknown module type ${type}`);
  }
}
