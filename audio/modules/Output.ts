import { Module } from "../Module";

export class OutputModule extends Module {
  public readonly gain: GainNode;

  constructor(ctx: AudioContext) {
    super("Output");

    this.gain = ctx.createGain();

    this.gain.gain.value = 0.5;
  }

  get input() {
    return this.gain;
  }

  get output() {
    return this.gain;
  }

  connect(destination: AudioNode) {
    this.gain.connect(destination);
  }

  setVolume(value: number) {
    this.gain.gain.setTargetAtTime(value, this.gain.context.currentTime, 0.01);
  }
}
