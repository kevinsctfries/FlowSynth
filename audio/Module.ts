export abstract class Module {
  public readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract get input(): AudioNode | null;

  abstract get output(): AudioNode | null;
}
