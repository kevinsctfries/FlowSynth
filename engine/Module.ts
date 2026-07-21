import { Port } from "./Port";
import { Parameter } from "./Parameter";

export abstract class Module {
  public readonly id: string;

  public readonly name: string;

  public ports: Port[] = [];

  public parameters: Parameter<any>[] = [];

  constructor(id: string, name: string) {
    this.id = id;

    this.name = name;
  }

  getPort(id: string) {
    return this.ports.find((port) => port.id === id);
  }

  getParameter(id: string) {
    return this.parameters.find((parameter) => parameter.id === id);
  }

  protected registerParameter<T>(parameter: Parameter<T>): Parameter<T> {
    this.parameters.push(parameter);

    return parameter;
  }
}
