import { Module } from "../engine/Module";
import { Port } from "../engine/Port";
import { Parameter } from "../engine/Parameter";

export class VCAModule extends Module {
  public readonly node: GainNode;

  public readonly level: Parameter<number>;

  private gateOpen = false;

  constructor(id: string, ctx: AudioContext) {
    super(id, "vca", "VCA");

    this.node = ctx.createGain();

    this.node.gain.value = 0.5;

    this.level = this.registerParameter(
      new Parameter({
        id: "level",
        name: "Level",
        type: "number",
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.01,
      }),
    );

    this.level.onChange(() => {
      this.applyGain();
    });

    this.ports.push(
      new Port({
        id: "audio_in",
        name: "Audio Input",
        type: "audio",
        direction: "input",
        node: this.node,
      }),
    );

    this.ports.push(
      new Port({
        id: "cv_in",
        name: "CV Input",
        type: "control",
        direction: "input",

        controlHandler: (value) => {
          this.node.gain.setValueAtTime(value, this.node.context.currentTime);
        },
      }),
    );

    this.ports.push(
      new Port({
        id: "gate_in",
        name: "Gate Input",
        type: "gate",
        direction: "input",

        gateHandler: (value) => {
          this.gateOpen = value;
          this.applyGain();
        },
      }),
    );

    this.ports.push(
      new Port({
        id: "audio_out",
        name: "Audio Output",
        type: "audio",
        direction: "output",
        node: this.node,
      }),
    );
  }

  private applyGain() {
    const target = this.gateOpen ? this.level.value : 0;
    this.node.gain.setValueAtTime(target, this.node.context.currentTime);
  }

  get gainParam(): AudioParam {
    return this.node.gain;
  }
}
