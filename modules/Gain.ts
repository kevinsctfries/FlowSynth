import { Module } from "../engine/Module";
import { Port } from "../engine/Port";

export class GainModule extends Module {
  public readonly gain: GainNode;

  constructor(id: string, ctx: AudioContext) {
    super(id, "Gain");

    this.gain = ctx.createGain();

    this.gain.gain.value = 1;

    this.ports.push(
      new Port({
        id: "audio_in",

        name: "Audio Input",

        type: "audio",

        direction: "input",

        node: this.gain,
      }),
    );

    this.ports.push(
      new Port({
        id: "audio_out",

        name: "Audio Output",

        type: "audio",

        direction: "output",

        node: this.gain,
      }),
    );
  }

  setGain(value: number) {
    this.gain.gain.setValueAtTime(
      value,

      this.gain.context.currentTime,
    );
  }

  get gainParam(): AudioParam {
    return this.gain.gain;
  }
}
