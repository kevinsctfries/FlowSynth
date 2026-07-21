import { Port } from "./Port";

export abstract class Module {
  public readonly id: string;

  public readonly name: string;

  public ports: Port[] = [];

  constructor(id: string, name: string) {
    this.id = id;

    this.name = name;
  }

  getPort(id: string) {
    return this.ports.find((port) => port.id === id);
  }
}
