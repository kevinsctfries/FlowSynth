export class EnvelopeModule {
  private ctx: AudioContext;

  private destination?: AudioParam;

  public attack = 0.1;
  public decay = 0.2;
  public sustain = 0.7;
  public release = 0.5;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
  }

  connect(destination: AudioParam) {
    this.destination = destination;
  }

  trigger(amount = 1) {
    if (!this.destination) return;

    const now = this.ctx.currentTime;

    this.destination.cancelScheduledValues(now);

    this.destination.setValueAtTime(0, now);

    this.destination.linearRampToValueAtTime(amount, now + this.attack);

    this.destination.linearRampToValueAtTime(
      amount * this.sustain,
      now + this.attack + this.decay,
    );
  }

  releaseNote() {
    if (!this.destination) return;

    const now = this.ctx.currentTime;

    this.destination.cancelScheduledValues(now);

    this.destination.setTargetAtTime(0, now, this.release);
  }

  setAttack(value: number) {
    this.attack = value;
  }

  setDecay(value: number) {
    this.decay = value;
  }

  setSustain(value: number) {
    this.sustain = value;
  }

  setRelease(value: number) {
    this.release = value;
  }
}
