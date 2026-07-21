import { Module } from "../engine/Module";
import { Port } from "../engine/Port";
import { Parameter } from "../engine/Parameter";

export class GainModule extends Module {
  public readonly gain: GainNode;

  public readonly level: Parameter<number>;

  constructor(id: string, ctx: AudioContext) {
    super(id, "Gain");

    this.gain = ctx.createGain();

    this.gain.gain.value = 1;

    this.level = this.registerParameter(
      new Parameter({
        id: "level",
        name: "Gain",
        type: "number",
        value: 1,
        min: 0,
        max: 1,
        step: 0.01,
      }),
    );

    this.level.onChange((value) => {
      this.gain.gain.setValueAtTime(value, this.gain.context.currentTime);
    });

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

  get gainParam(): AudioParam {
    return this.gain.gain;
  }
}
