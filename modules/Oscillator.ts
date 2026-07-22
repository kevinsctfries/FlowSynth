import { Module } from "../engine/Module";
import { Port } from "../engine/Port";
import { Parameter } from "../engine/Parameter";

export class OscillatorModule extends Module {
  private pitchCV = 0;

  public readonly oscillator: OscillatorNode;

  public readonly frequency: Parameter<number>;

  public readonly waveform: Parameter<OscillatorType>;

  constructor(id: string, ctx: AudioContext) {
    super(id, "oscillator", "Oscillator");

    this.oscillator = ctx.createOscillator();

    this.oscillator.type = "sawtooth";

    this.oscillator.frequency.value = 440;

    this.oscillator.start();

    this.frequency = this.registerParameter(
      new Parameter({
        id: "frequency",
        name: "Frequency",
        type: "number",
        value: 440,
        min: 20,
        max: 2000,
        step: 1,
      }),
    );

    this.frequency.onChange(() => {
      this.updateFrequency();
    });

    this.waveform = this.registerParameter(
      new Parameter<OscillatorType>({
        id: "waveform",
        name: "Waveform",
        type: "enum",
        value: "sawtooth",
        options: ["sine", "square", "sawtooth", "triangle"],
      }),
    );

    this.waveform.onChange((value) => {
      this.oscillator.type = value;
    });

    this.ports.push(
      new Port({
        id: "pitch_cv",
        name: "Pitch CV",
        type: "control",
        direction: "input",

        controlHandler: (value) => {
          console.log("OSCILLATOR RECEIVED PITCH:", value);

          this.pitchCV = value;

          this.updateFrequency();
        },
      }),
    );

    this.ports.push(
      new Port({
        id: "audio_out",
        name: "Audio Output",
        type: "audio",
        direction: "output",
        node: this.oscillator,
      }),
    );
  }

  private updateFrequency() {
    const frequency = this.pitchCV > 0 ? this.pitchCV : this.frequency.value;

    this.oscillator.frequency.setValueAtTime(
      frequency,
      this.oscillator.context.currentTime,
    );
  }
}
