import { AudioEngine } from "../engine/AudioEngine";
import { Patch } from "../engine/Patch";
import { EnvelopeModule } from "../modules/Envelope";
import { FilterModule } from "../modules/Filter";
import { GainModule } from "../modules/Gain";
import { OscillatorModule } from "../modules/Oscillator";

export class Voice {
  private oscillator: OscillatorModule;

  private filter: FilterModule;

  private gain: GainModule;

  private envelope: EnvelopeModule;

  private patch: Patch;

  private active = false;

  constructor(engine: AudioEngine, index: number, output: AudioNode) {
    this.patch = new Patch(engine);

    this.oscillator = new OscillatorModule(
      `voice-${index}-oscillator`,
      engine.context,
    );

    this.filter = new FilterModule(`voice-${index}-filter`, engine.context);

    this.gain = new GainModule(`voice-${index}-gain`, engine.context);

    this.envelope = new EnvelopeModule(engine.context);

    this.patch.addModule(this.oscillator);

    this.patch.addModule(this.filter);

    this.patch.addModule(this.gain);

    this.patch.connect(
      this.oscillator.id,
      "audio_out",
      this.filter.id,
      "audio_in",
    );

    this.patch.connect(this.filter.id, "audio_out", this.gain.id, "audio_in");

    this.gain.gain.connect(output);

    this.envelope.connect(this.gain.gainParam);
  }

  noteOn(note: number, velocity: number) {
    const frequency = 440 * Math.pow(2, (note - 69) / 12);

    this.oscillator.frequency.setValue(frequency);

    this.envelope.trigger(velocity / 127);

    this.active = true;
  }

  noteOff() {
    this.envelope.releaseNote();

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
    this.oscillator.waveform.setValue(type);
  }

  setCutoff(value: number) {
    this.filter.cutoff.setValue(value);
  }

  setResonance(value: number) {
    this.filter.resonance.setValue(value);
  }
}
