export type PortType = "audio" | "control";

export type PortDirection = "input" | "output";

export class Port {
  public readonly id: string;

  public readonly name: string;

  public readonly type: PortType;

  public readonly direction: PortDirection;

  public readonly node?: AudioNode;

  public readonly parameter?: AudioParam;

  constructor(options: {
    id: string;
    name: string;
    type: PortType;
    direction: PortDirection;
    node?: AudioNode;
    parameter?: AudioParam;
  }) {
    this.id = options.id;

    this.name = options.name;

    this.type = options.type;

    this.direction = options.direction;

    this.node = options.node;

    this.parameter = options.parameter;
  }
}
