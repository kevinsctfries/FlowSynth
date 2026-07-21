export class MidiManager {
  async connect(
    callback: (note: number, velocity: number, pressed: boolean) => void,
  ) {
    const access = await navigator.requestMIDIAccess();

    access.inputs.forEach((input) => {
      input.onmidimessage = (event) => {
        if (!event.data) return;

        const [status, note, velocity] = event.data;

        const command = status & 0xf0;

        if (command === 0x90 && velocity > 0) {
          callback(note, velocity, true);
        }

        if (command === 0x80 || (command === 0x90 && velocity === 0)) {
          callback(note, velocity, false);
        }
      };
    });
  }
}
