import { Module } from "../engine/Module";
import { Parameter } from "../engine/Parameter";
import { Port } from "../engine/Port";
import { Signal } from "../engine/Signal";

export class EnvelopeModule extends Module {
  private ctx: AudioContext;

  private timers: number[] = [];

  public readonly attack: Parameter<number>;
  public readonly decay: Parameter<number>;
  public readonly sustain: Parameter<number>;
  public readonly release: Parameter<number>;

  public readonly outputSignal = new Signal<number>();

  constructor(id: string, ctx: AudioContext) {
    super(id, "envelope", "Envelope");
    this.ctx = ctx;

    this.attack = this.registerParameter(
      new Parameter({
        id: "attack",
        name: "Attack",
        type: "number",
        value: 0.1,
        min: 0,
        max: 2,
        step: 0.01,
      }),
    );

    this.decay = this.registerParameter(
      new Parameter({
        id: "decay",
        name: "Decay",
        type: "number",
        value: 0.2,
        min: 0,
        max: 2,
        step: 0.01,
      }),
    );

    this.sustain = this.registerParameter(
      new Parameter({
        id: "sustain",
        name: "Sustain",
        type: "number",
        value: 0.7,
        min: 0,
        max: 1,
        step: 0.01,
      }),
    );

    this.release = this.registerParameter(
      new Parameter({
        id: "release",
        name: "Release",
        type: "number",
        value: 0.5,
        min: 0,
        max: 3,
        step: 0.01,
      }),
    );

    this.ports.push(
      new Port({
        id: "gate_in",
        name: "Gate Input",
        type: "gate",
        direction: "input",

        gateHandler: (value) => {
          this.setGateState(value);
        },
      }),
    );

    this.ports.push(
      new Port({
        id: "cv_out",
        name: "CV Output",
        type: "control",
        direction: "output",
        signal: this.outputSignal,
      }),
    );
  }

  private emit(value: number) {
    this.outputSignal.emit(value);
  }

  setGateState(value: boolean) {
    if (value) {
      this.trigger();
      return;
    }
    this.releaseNote();
  }

  private clearTimers() {
    for (const timer of this.timers) {
      clearTimeout(timer);
    }
    this.timers = [];
  }

  trigger(amount = 1) {
    this.clearTimers();

    this.emit(0);

    const attackTimer = window.setTimeout(() => {
      this.emit(amount);

      const decayTimer = window.setTimeout(() => {
        this.emit(amount * this.sustain.value);
      }, this.decay.value * 1000);

      this.timers.push(decayTimer);
    }, this.attack.value * 1000);

    this.timers.push(attackTimer);
  }

  releaseNote() {
    this.clearTimers();
    this.emit(0);
  }
}
