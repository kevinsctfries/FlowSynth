import { Module } from "../engine/Module";
import { Port } from "../engine/Port";

export class OscillatorModule extends Module {
  public readonly oscillator: OscillatorNode;

  constructor(id: string, ctx: AudioContext) {
    super(id, "Oscillator");

    this.oscillator = ctx.createOscillator();

    this.oscillator.type = "sawtooth";

    this.oscillator.frequency.value = 440;

    this.oscillator.start();

    this.ports.push(
      new Port({
        id: "audio_out",

        name: "Audio Output",

        type: "audio",

        direction: "output",

        node: this.oscillator,
      }),
    );
  }

  setFrequency(value: number) {
    this.oscillator.frequency.setValueAtTime(
      value,

      this.oscillator.context.currentTime,
    );
  }

  setWaveform(value: OscillatorType) {
    this.oscillator.type = value;
  }
}
