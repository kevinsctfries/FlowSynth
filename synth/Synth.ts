import { AudioEngine } from "../engine/AudioEngine";
import { OutputModule } from "../modules/Output";
import { Voice } from "./Voice";

type VoiceMode = "mono" | "poly";

export class Synth {
  private voices: Voice[] = [];

  private mode: VoiceMode = "poly";

  private maxVoices = 8;

  private noteMap = new Map<number, Voice[]>();

  private output: OutputModule;

  constructor(engine: AudioEngine) {
    this.output = new OutputModule("synth-output", engine.context);

    for (let i = 0; i < this.maxVoices; i++) {
      this.voices.push(new Voice(engine, i, this.output.input));
    }
  }

  setMode(mode: VoiceMode) {
    this.mode = mode;
  }

  noteOn(note: number, velocity: number) {
    if (this.mode === "mono") {
      const voice = this.voices[0];

      voice.noteOn(note, velocity);

      this.noteMap.set(note, [voice]);

      return;
    }

    const voice = this.voices.find((v) => !v.isActive());

    if (!voice) {
      console.warn("No free voices");

      return;
    }

    voice.noteOn(note, velocity);

    const existing = this.noteMap.get(note) ?? [];

    existing.push(voice);

    this.noteMap.set(note, existing);
  }

  noteOff(note: number) {
    const voices = this.noteMap.get(note);

    if (!voices) {
      return;
    }

    for (const voice of voices) {
      voice.noteOff();
    }

    this.noteMap.delete(note);
  }

  setVolume(value: number) {
    this.output.setVolume(value);
  }

  setAttack(value: number) {
    for (const voice of this.voices) {
      voice.setAttack(value);
    }
  }

  setDecay(value: number) {
    for (const voice of this.voices) {
      voice.setDecay(value);
    }
  }

  setSustain(value: number) {
    for (const voice of this.voices) {
      voice.setSustain(value);
    }
  }

  setRelease(value: number) {
    for (const voice of this.voices) {
      voice.setRelease(value);
    }
  }

  setWaveform(type: OscillatorType) {
    for (const voice of this.voices) {
      voice.setWaveform(type);
    }
  }

  setCutoff(value: number) {
    for (const voice of this.voices) {
      voice.setCutoff(value);
    }
  }

  setResonance(value: number) {
    for (const voice of this.voices) {
      voice.setResonance(value);
    }
  }
}
