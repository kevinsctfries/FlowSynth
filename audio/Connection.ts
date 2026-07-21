import { Port } from "./Port";

export class Connection {
  public readonly source: Port;

  public readonly destination: Port;

  constructor(source: Port, destination: Port) {
    this.source = source;

    this.destination = destination;
  }

  connect() {
    if (this.source.node && this.destination.node) {
      this.source.node.connect(this.destination.node);

      return;
    }

    if (this.source.node && this.destination.parameter) {
      this.source.node.connect(this.destination.parameter);

      return;
    }

    throw new Error("Invalid connection");
  }

  disconnect() {
    if (this.source.node && this.destination.node) {
      this.source.node.disconnect(this.destination.node);

      return;
    }

    if (this.source.node && this.destination.parameter) {
      this.source.node.disconnect(this.destination.parameter);

      return;
    }
  }
}
