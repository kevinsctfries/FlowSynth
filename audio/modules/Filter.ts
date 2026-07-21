import { Module } from "../Module";

export class FilterModule extends Module {
  public readonly filter: BiquadFilterNode;

  private ctx: AudioContext;

  constructor(ctx: AudioContext) {
    super("Filter");

    this.ctx = ctx;

    this.filter = ctx.createBiquadFilter();

    this.filter.type = "lowpass";

    this.filter.frequency.value = 1000;

    this.filter.Q.value = 1;
  }

  connect(destination: AudioNode) {
    this.filter.connect(destination);
  }

  get input() {
    return this.filter;
  }

  get output() {
    return this.filter;
  }

  setCutoff(value: number) {
    this.filter.frequency.setTargetAtTime(value, this.ctx.currentTime, 0.01);
  }

  setResonance(value: number) {
    this.filter.Q.setTargetAtTime(value, this.ctx.currentTime, 0.01);
  }
}
