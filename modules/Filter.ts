import { Module } from "../engine/Module";
import { Port } from "../engine/Port";
import { Parameter } from "../engine/Parameter";

export class FilterModule extends Module {
  public readonly filter: BiquadFilterNode;

  public readonly cutoff: Parameter<number>;

  public readonly resonance: Parameter<number>;

  public readonly filterType: Parameter<BiquadFilterType>;

  constructor(id: string, ctx: AudioContext) {
    super(id, "filter", "Filter");

    this.filter = ctx.createBiquadFilter();

    this.filter.type = "lowpass";

    this.filter.frequency.value = 1000;

    this.filter.Q.value = 1;

    this.cutoff = this.registerParameter(
      new Parameter({
        id: "cutoff",
        name: "Cutoff",
        type: "number",
        value: 1000,
        min: 20,
        max: 20000,
        step: 10,
      }),
    );

    this.cutoff.onChange((value) => {
      this.filter.frequency.setValueAtTime(
        value,
        this.filter.context.currentTime,
      );
    });

    this.resonance = this.registerParameter(
      new Parameter({
        id: "resonance",
        name: "Resonance",
        type: "number",
        value: 1,
        min: 0,
        max: 20,
        step: 0.1,
      }),
    );

    this.resonance.onChange((value) => {
      this.filter.Q.setValueAtTime(value, this.filter.context.currentTime);
    });

    this.filterType = this.registerParameter(
      new Parameter<BiquadFilterType>({
        id: "type",
        name: "Type",
        type: "enum",
        value: "lowpass",
        options: ["lowpass", "highpass", "bandpass", "notch"],
      }),
    );

    this.filterType.onChange((value) => {
      this.filter.type = value;
    });

    this.ports.push(
      new Port({
        id: "audio_in",
        name: "Audio Input",
        type: "audio",
        direction: "input",
        node: this.filter,
      }),
    );

    this.ports.push(
      new Port({
        id: "audio_out",
        name: "Audio Output",
        type: "audio",
        direction: "output",
        node: this.filter,
      }),
    );
  }
}
