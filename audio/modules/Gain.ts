import { Module } from "../Module";

export class GainModule extends Module {
  private node: GainNode;

  constructor(ctx: AudioContext) {
    super("Gain");

    this.node = ctx.createGain();

    this.node.gain.value = 0.0001;
  }

  get input() {
    return this.node;
  }

  get output() {
    return this.node;
  }

  get volume() {
    return this.node.gain;
  }

  connect(destination: AudioNode) {
    this.node.connect(destination);
  }

  open(amount: number = 1) {
    const now = this.node.context.currentTime;

    this.node.gain.cancelScheduledValues(now);

    this.node.gain.setValueAtTime(Math.max(this.node.gain.value, 0.0001), now);

    this.node.gain.exponentialRampToValueAtTime(
      Math.max(amount, 0.0001),
      now + 0.01,
    );
  }

  close() {
    const now = this.node.context.currentTime;

    this.node.gain.cancelScheduledValues(now);

    this.node.gain.setValueAtTime(Math.max(this.node.gain.value, 0.0001), now);

    this.node.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
  }

  setVolume(value: number) {
    const now = this.node.context.currentTime;

    this.node.gain.cancelScheduledValues(now);

    this.node.gain.setTargetAtTime(Math.max(value, 0.0001), now, 0.01);
  }
}
