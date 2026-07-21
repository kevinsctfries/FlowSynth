import { AudioEngine } from "./AudioEngine";
import { Patch } from "./Patch";

import { OscillatorModule } from "./modules/Oscillator";
import { FilterModule } from "./modules/Filter";
import { GainModule } from "./modules/Gain";
import { EnvelopeModule } from "./modules/Envelope";

export class Voice {
  private oscillator: OscillatorModule;

  private filter: FilterModule;

  private gain: GainModule;

  private envelope: EnvelopeModule;

  private patch: Patch;

  private active = false;

  constructor(engine: AudioEngine, output: AudioNode) {
    this.patch = new Patch();

    this.oscillator = new OscillatorModule(engine.context);

    this.filter = new FilterModule(engine.context);

    this.gain = new GainModule(engine.context);

    this.envelope = new EnvelopeModule(engine.context);

    this.patch.addModule(this.oscillator);

    this.patch.addModule(this.filter);

    this.patch.addModule(this.gain);

    this.patch.connect(this.oscillator, this.filter);

    this.patch.connect(this.filter, this.gain);

    this.gain.connect(output);

    this.envelope.connect(this.gain.volume);

    this.oscillator.start();
  }

  noteOn(note: number, velocity: number) {
    const frequency = 440 * Math.pow(2, (note - 69) / 12);

    this.oscillator.setFrequency(frequency);

    this.envelope.trigger(velocity / 127);

    this.gain.open(velocity / 127);

    this.active = true;
  }

  noteOff() {
    this.envelope.releaseNote();

    this.gain.close();

    this.active = false;
  }

  isActive() {
    return this.active;
  }

  setAttack(value: number) {
    this.envelope.setAttack(value);
  }

  setDecay(value: number) {
    this.envelope.setDecay(value);
  }

  setSustain(value: number) {
    this.envelope.setSustain(value);
  }

  setRelease(value: number) {
    this.envelope.setRelease(value);
  }

  setWaveform(type: OscillatorType) {
    this.oscillator.setWaveform(type);
  }

  setCutoff(value: number) {
    this.filter.setCutoff(value);
  }

  setResonance(value: number) {
    this.filter.setResonance(value);
  }
}
