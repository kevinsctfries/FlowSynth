import { AudioEngine } from "../engine/AudioEngine";
import { Patch } from "../engine/Patch";

import { OscillatorModule } from "../modules/Oscillator";
import { FilterModule } from "../modules/Filter";
import { VCAModule } from "../modules/VCA";
import { EnvelopeModule } from "../modules/Envelope";

import type { Port } from "../engine/Port";

export class Voice {
  private oscillator: OscillatorModule;

  private filter: FilterModule;

  private vca: VCAModule;

  private envelope: EnvelopeModule;

  private patch: Patch;

  private active = false;

  private currentNote?: number;

  private pitchInput?: Port;

  constructor(engine: AudioEngine, index: number, output: AudioNode) {
    this.patch = new Patch(engine);

    this.oscillator = new OscillatorModule(
      `voice-${index}-oscillator`,
      engine.context,
    );

    this.filter = new FilterModule(`voice-${index}-filter`, engine.context);

    this.vca = new VCAModule(`voice-${index}-vca`, engine.context);

    this.envelope = new EnvelopeModule(
      `voice-${index}-envelope`,
      engine.context,
    );

    this.patch.addModule(this.oscillator);

    this.patch.addModule(this.filter);

    this.patch.addModule(this.vca);

    this.patch.addModule(this.envelope);

    this.patch.connect(
      this.oscillator.id,
      "audio_out",
      this.filter.id,
      "audio_in",
    );

    this.patch.connect(this.filter.id, "audio_out", this.vca.id, "audio_in");

    this.patch.connect(this.envelope.id, "cv_out", this.vca.id, "cv_in");

    this.vca.node.connect(output);
  }

  noteOn() {
    this.envelope.trigger();

    this.active = true;
  }

  noteOff() {
    this.envelope.releaseNote();

    this.active = false;
    this.currentNote = undefined;
  }

  isActive() {
    return this.active;
  }

  setAttack(value: number) {
    this.envelope.attack.setValue(value);
  }

  setDecay(value: number) {
    this.envelope.decay.setValue(value);
  }

  setSustain(value: number) {
    this.envelope.sustain.setValue(value);
  }

  setRelease(value: number) {
    this.envelope.release.setValue(value);
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
