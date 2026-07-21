import { Port } from "./Port";

export class Connection {
  public readonly source: Port;

  public readonly destination: Port;

  constructor(source: Port, destination: Port) {
    this.source = source;

    this.destination = destination;
  }

  private target(): AudioNode | AudioParam {
    if (!this.source.node) {
      throw new Error("Invalid connection");
    }

    if (this.destination.node) {
      return this.destination.node;
    }

    if (this.destination.parameter) {
      return this.destination.parameter;
    }

    throw new Error("Invalid connection");
  }

  connect() {
    this.source.node!.connect(this.target() as AudioNode);
  }

  disconnect() {
    this.source.node!.disconnect(this.target() as AudioNode);
  }
}
