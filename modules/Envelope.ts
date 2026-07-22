import { Module } from "../engine/Module";
import { Parameter } from "../engine/Parameter";
import { Port } from "../engine/Port";
import { Signal } from "../engine/Signal";

type Stage = "idle" | "attack" | "decay" | "sustain" | "release";

export class EnvelopeModule extends Module {
  private ctx: AudioContext;

  private stage: Stage = "idle";

  private stageStartTime = 0;

  private stageStartValue = 0;

  private currentValue = 0;

  private triggerAmount = 1;

  private schedulerHandle?: number;

  public readonly attack: Parameter<number>;

  public readonly decay: Parameter<number>;

  public readonly sustain: Parameter<number>;

  public readonly release: Parameter<number>;

  public readonly outputSignal = new Signal<number>(0);

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

  setGateState(value: boolean) {
    if (value) {
      this.trigger();
      return;
    }

    this.releaseNote();
  }

  trigger(amount = 1) {
    this.triggerAmount = amount;
    this.beginStage("attack");
  }

  releaseNote() {
    this.beginStage("release");
  }

  private beginStage(stage: Stage) {
    this.stage = stage;
    this.stageStartTime = this.ctx.currentTime;
    this.stageStartValue = this.currentValue;
    this.startScheduler();
  }

  private startScheduler() {
    if (this.schedulerHandle !== undefined) {
      return;
    }

    const tick = () => {
      this.advance();

      const stillRunning =
        this.stage === "attack" ||
        this.stage === "decay" ||
        this.stage === "release";

      this.schedulerHandle = stillRunning
        ? window.setTimeout(tick, 15)
        : undefined;
    };

    tick();
  }

  private advance() {
    const elapsed = this.ctx.currentTime - this.stageStartTime;

    if (this.stage === "attack") {
      const duration = this.attack.value;
      const target = this.triggerAmount;

      if (duration <= 0 || elapsed >= duration) {
        this.emit(target);
        this.stage = "decay";
        this.stageStartTime = this.ctx.currentTime;
        this.stageStartValue = target;
        return;
      }

      this.emit(this.lerp(this.stageStartValue, target, elapsed / duration));
      return;
    }

    if (this.stage === "decay") {
      const duration = this.decay.value;
      const target = this.triggerAmount * this.sustain.value;

      if (duration <= 0 || elapsed >= duration) {
        this.emit(target);
        this.stage = "sustain";
        return;
      }

      this.emit(this.lerp(this.stageStartValue, target, elapsed / duration));
      return;
    }

    if (this.stage === "release") {
      const duration = this.release.value;

      if (duration <= 0 || elapsed >= duration) {
        this.emit(0);
        this.stage = "idle";
        return;
      }

      this.emit(this.lerp(this.stageStartValue, 0, elapsed / duration));
    }
  }

  private lerp(from: number, to: number, t: number): number {
    const clamped = Math.min(Math.max(t, 0), 1);
    return from + (to - from) * clamped;
  }

  private emit(value: number) {
    this.currentValue = value;
    this.outputSignal.emit(value);
  }
}
