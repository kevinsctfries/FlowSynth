import { Module } from "../Module";
import { Port } from "../Port";

export class FilterModule extends Module {
  public readonly filter: BiquadFilterNode;

  constructor(id: string, ctx: AudioContext) {
    super(id, "Filter");

    this.filter = ctx.createBiquadFilter();

    this.filter.type = "lowpass";

    this.filter.frequency.value = 1000;

    this.filter.Q.value = 1;

    this.ports.push(
      new Port({
        id: "audio_in",

        name: "Audio Input",

        type: "audio",

        direction: "input",

        node: this.filter,
      }),
    );

    this.ports.push(
      new Port({
        id: "audio_out",

        name: "Audio Output",

        type: "audio",

        direction: "output",

        node: this.filter,
      }),
    );
  }

  setCutoff(value: number) {
    this.filter.frequency.setValueAtTime(
      value,

      this.filter.context.currentTime,
    );
  }

  setResonance(value: number) {
    this.filter.Q.setValueAtTime(
      value,

      this.filter.context.currentTime,
    );
  }

  setType(type: BiquadFilterType) {
    this.filter.type = type;
  }
}
