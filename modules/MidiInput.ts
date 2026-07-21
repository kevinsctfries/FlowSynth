import { Module } from "../engine/Module";
import { Port } from "../engine/Port";
import { Signal } from "../engine/Signal";

export class MidiInputModule extends Module {
  private midiAccess?: MIDIAccess;

  private selectedInput?: MIDIInput;

  private activeNotes = new Set<number>();

  public readonly gateSignal = new Signal<boolean>();

  public readonly pitchSignal = new Signal<number>();

  public readonly velocitySignal = new Signal<number>();

  public readonly devicesChanged = new Signal<MIDIInput[]>();

  public initialized = false;

  constructor(id: string) {
    super(id, "MIDI Input");

    this.ports.push(
      new Port({
        id: "gate_out",
        name: "Gate Output",
        type: "gate",
        direction: "output",
        gateSignal: this.gateSignal,
      }),
    );

    this.ports.push(
      new Port({
        id: "pitch_out",
        name: "Pitch CV",
        type: "control",
        direction: "output",
        signal: this.pitchSignal,
      }),
    );

    this.ports.push(
      new Port({
        id: "velocity_out",
        name: "Velocity CV",
        type: "control",
        direction: "output",
        signal: this.velocitySignal,
      }),
    );

    this.init();
  }

  private async init() {
    this.midiAccess = await navigator.requestMIDIAccess();

    this.initialized = true;

    const devices = Array.from(this.midiAccess.inputs.values());

    console.log("Available MIDI devices:");

    devices.forEach((input) => {
      console.log(input.name, input.manufacturer, input.id);
    });

    this.devicesChanged.emit(devices);
  }
  getDevices() {
    return Array.from(this.midiAccess?.inputs.values() ?? []);
  }

  selectDevice(id: string) {
    if (!this.midiAccess) {
      console.error("MIDI access unavailable");
      return;
    }

    const input = this.midiAccess.inputs.get(id);

    if (!input) {
      console.error("MIDI device not found:", id);
      return;
    }

    // Remove old listener if changing devices
    if (this.selectedInput) {
      this.selectedInput.onmidimessage = null;
    }

    this.selectedInput = input;

    input.onmidimessage = (event) => {
      this.handleMidiMessage(event);
    };

    console.log("Selected MIDI device:", input.name);
  }

  private handleMidiMessage(event: MIDIMessageEvent) {
    if (!event.data) {
      return;
    }

    const [status, note, velocity] = event.data;

    const command = status & 0xf0;

    if (command === 0x90 && velocity > 0) {
      if (this.activeNotes.has(note)) {
        return;
      }

      this.activeNotes.add(note);

      const frequency = 440 * Math.pow(2, (note - 69) / 12);

      console.log("MIDI NOTE ON:", note, velocity);

      console.log("PITCH OUTPUT:", frequency);

      this.pitchSignal.emit(frequency);

      this.velocitySignal.emit(velocity / 127);

      this.gateSignal.emit(true);

      return;
    }

    if (command === 0x80 || (command === 0x90 && velocity === 0)) {
      if (!this.activeNotes.has(note)) {
        return;
      }

      this.activeNotes.delete(note);

      console.log("MIDI NOTE OFF:", note);

      this.gateSignal.emit(false);
    }
  }
}
