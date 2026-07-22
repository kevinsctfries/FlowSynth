// engine/VoiceAllocator.ts
export type VoiceMode = "mono" | "poly";

export type VoiceOnResult = { voice: number; stolen: boolean };

export class VoiceAllocator {
  private voiceCount: number;
  private mode: VoiceMode = "poly";
  private noteToVoice = new Map<number, number>();
  private voiceToNote = new Map<number, number>();
  private freeVoices: number[];
  private voiceOrder: number[] = []; // oldest-first, for voice-stealing

  constructor(voiceCount: number) {
    this.voiceCount = voiceCount;
    this.freeVoices = Array.from({ length: voiceCount }, (_, i) => i);
  }

  setMode(mode: VoiceMode) {
    console.log("ALLOCATOR MODE:", mode);

    this.mode = mode;
  }

  getVoiceCount(): number {
    return this.voiceCount;
  }

  setVoiceCount(count: number) {
    this.noteToVoice.clear();
    this.voiceToNote.clear();
    this.voiceOrder = [];
    this.voiceCount = count;
    this.freeVoices = Array.from({ length: count }, (_, i) => i);
  }

  noteOn(note: number): VoiceOnResult {
    if (this.mode === "mono") {
      const voice = 0;
      this.assign(note, voice);
      return { voice, stolen: false };
    }

    const free = this.freeVoices.shift();
    if (free !== undefined) {
      this.assign(note, free);
      return { voice: free, stolen: false };
    }

    const stolen = this.voiceOrder[0];
    const stolenNote = this.voiceToNote.get(stolen);
    if (stolenNote !== undefined) this.noteToVoice.delete(stolenNote);

    this.assign(note, stolen);
    return { voice: stolen, stolen: true };
  }

  noteOff(note: number): number | undefined {
    const voice = this.noteToVoice.get(note);
    if (voice === undefined) return undefined;

    this.noteToVoice.delete(note);
    this.voiceToNote.delete(voice);
    this.voiceOrder = this.voiceOrder.filter((v) => v !== voice);

    if (this.mode === "poly") this.freeVoices.push(voice);
    return voice;
  }

  private assign(note: number, voice: number) {
    this.noteToVoice.set(note, voice);
    this.voiceToNote.set(voice, note);
    this.voiceOrder = this.voiceOrder.filter((v) => v !== voice);
    this.voiceOrder.push(voice);
  }
}
