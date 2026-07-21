import { Module } from "../engine/Module";
import { Parameter } from "../engine/Parameter";
import { Port } from "../engine/Port";
import { ControlSignal } from "../engine/Signal";

export class EnvelopeModule extends Module {
  private ctx: AudioContext;

  public readonly attack: Parameter<number>;

  public readonly decay: Parameter<number>;

  public readonly sustain: Parameter<number>;

  public readonly release: Parameter<number>;

  public readonly outputSignal = new ControlSignal();

  constructor(id: string, ctx: AudioContext) {
    super(id, "Envelope");

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

  // private emit(value: number) {
  //   for (const listener of this.listeners) {
  //     listener(value);
  //   }
  // }

  private emit(value: number) {
    console.log("Envelope CV output:", value);

    this.outputSignal.emit(value);
  }

  // setGateState(value: boolean) {
  //   if (value) {
  //     this.trigger();
  //   } else {
  //     this.releaseNote();
  //   }
  // }

  setGateState(value: boolean) {
    console.log("Envelope gate received:", value);

    if (value) {
      this.trigger();
      return;
    }

    this.releaseNote();
  }

  trigger(amount = 1) {
    const now = this.ctx.currentTime;

    this.emit(0);

    setTimeout(() => {
      this.emit(amount);

      setTimeout(() => {
        this.emit(amount * this.sustain.value);
      }, this.decay.value * 1000);
    }, this.attack.value * 1000);
  }

  releaseNote() {
    this.emit(0);
  }
}
