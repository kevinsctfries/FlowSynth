import { Module } from "../engine/Module";
import { Port } from "../engine/Port";

export class GateInputModule extends Module {
  private listeners: ((value: boolean) => void)[] = [];

  private isOpen = false;

  constructor(id: string) {
    super(id, "gate", "Gate Input");

    this.ports.push(
      new Port({
        id: "gate_out",
        name: "Gate Output",
        type: "gate",
        direction: "output",
      }),
    );
  }

  subscribe(callback: (value: boolean) => void) {
    this.listeners.push(callback);

    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback,
      );
    };
  }

  isGateOpen() {
    return this.isOpen;
  }

  private emit(value: boolean) {
    if (this.isOpen === value) {
      return;
    }

    this.isOpen = value;

    console.log(value ? "Gate ON" : "Gate OFF");

    for (const listener of this.listeners) {
      listener(value);
    }
  }

  noteOn() {
    this.emit(true);
  }

  noteOff() {
    this.emit(false);
  }
}
