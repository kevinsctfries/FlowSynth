export class AudioEngine {
  public readonly context: AudioContext;

  constructor() {
    this.context = new AudioContext();
  }

  async start() {
    if (this.context.state === "suspended") {
      await this.context.resume();
    }
  }
}
