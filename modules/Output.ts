import { Module } from "../engine/Module";
import { Port } from "../engine/Port";

export class OutputModule extends Module {
  public readonly gain: GainNode;

  constructor(id: string, ctx: AudioContext) {
    super(id, "output", "Output");

    this.gain = ctx.createGain();

    this.gain.connect(ctx.destination);

    this.ports.push(
      new Port({
        id: "audio_in",

        name: "Audio Input",

        type: "audio",

        direction: "input",

        node: this.gain,
      }),
    );
  }

  get input(): AudioNode {
    return this.gain;
  }

  setVolume(value: number) {
    this.gain.gain.setValueAtTime(value, this.gain.context.currentTime);
  }

  dispose() {
    this.gain.disconnect();
  }
}
