import { Port } from "./Port";

export class Connection {
  public readonly source: Port;

  public readonly destination: Port;

  constructor(source: Port, destination: Port) {
    this.source = source;

    this.destination = destination;
  }

  connect() {
    if (this.source.type === "audio" && this.destination.type === "audio") {
      this.connectAudio();

      return;
    }

    if (this.source.type === "control" && this.destination.type === "control") {
      this.connectControl();

      return;
    }

    if (this.source.type === "gate" && this.destination.type === "gate") {
      this.connectGate();

      return;
    }

    throw new Error(
      `Cannot connect ${this.source.type} to ${this.destination.type}`,
    );
  }

  disconnect() {
    if (this.source.type === "audio" && this.destination.type === "audio") {
      this.disconnectAudio();

      return;
    }
  }

  private connectAudio() {
    if (!this.source.node) {
      throw new Error("Audio source has no AudioNode");
    }

    if (this.destination.node) {
      this.source.node.connect(this.destination.node);

      console.log(
        "Audio connection created:",
        this.source.id,
        "->",
        this.destination.id,
      );

      return;
    }

    if (this.destination.parameter) {
      this.source.node.connect(this.destination.parameter);

      console.log(
        "Audio parameter connection created:",
        this.source.id,
        "->",
        this.destination.id,
      );

      return;
    }

    throw new Error("Audio destination has no node or parameter");
  }

  private disconnectAudio() {
    if (!this.source.node) {
      return;
    }

    if (this.destination.node) {
      this.source.node.disconnect(this.destination.node);
    }
  }

  private connectControl() {
    console.log(
      "Control connection created:",
      this.source.id,
      "->",
      this.destination.id,
    );

    if (!this.source.signal) {
      throw new Error("Control source has no signal");
    }

    if (!this.destination.controlHandler) {
      throw new Error("Control destination has no handler");
    }

    this.source.signal.subscribe((value) => {
      console.log("Control signal passed:", this.source.id, "value:", value);

      this.destination.controlHandler!(value);
    });
  }

  private connectGate() {
    console.log(
      "Gate connection created:",
      this.source.id,
      "->",
      this.destination.id,
    );

    if (!this.source.gateSignal || !this.destination.gateHandler) {
      throw new Error("Invalid gate connection");
    }

    this.source.gateSignal.subscribe(this.destination.gateHandler);
  }
}
