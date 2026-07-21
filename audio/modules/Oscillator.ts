import { Module } from "../Module";

export class OscillatorModule extends Module {
  private oscillator: OscillatorNode;

  private ctx: AudioContext;

  constructor(ctx: AudioContext) {
    super("Oscillator");

    this.ctx = ctx;

    this.oscillator = ctx.createOscillator();

    this.oscillator.type = "sine";

    this.oscillator.frequency.value = 440;
  }

  start() {
    this.oscillator.start();
  }

  connect(destination: AudioNode) {
    this.oscillator.connect(destination);
  }

  get input() {
    return null;
  }

  get output() {
    return this.oscillator;
  }

  setFrequency(freq: number) {
    const now = this.ctx.currentTime;

    this.oscillator.frequency.cancelScheduledValues(now);

    this.oscillator.frequency.setValueAtTime(
      this.oscillator.frequency.value,
      now,
    );

    this.oscillator.frequency.exponentialRampToValueAtTime(freq, now + 0.01);
  }

  setWaveform(type: OscillatorType) {
    this.oscillator.type = type;
  }
}
