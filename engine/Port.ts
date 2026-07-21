import type { ControlSignal, GateSignal } from "./Signal";

export type PortType = "audio" | "control" | "gate";

export type PortDirection = "input" | "output";

export class Port {
  public readonly id: string;

  public readonly name: string;

  public readonly type: PortType;

  public readonly direction: PortDirection;

  public readonly node?: AudioNode;

  public readonly parameter?: AudioParam;

  public readonly controlHandler?: (value: number) => void;

  public readonly gateHandler?: (value: boolean) => void;

  public readonly signal?: ControlSignal;

  public readonly gateSignal?: GateSignal;

  constructor(options: {
    id: string;
    name: string;
    type: PortType;
    direction: PortDirection;

    node?: AudioNode;

    parameter?: AudioParam;

    controlHandler?: (value: number) => void;

    gateHandler?: (value: boolean) => void;

    signal?: ControlSignal;

    gateSignal?: GateSignal;
  }) {
    this.id = options.id;

    this.name = options.name;

    this.type = options.type;

    this.direction = options.direction;

    this.node = options.node;

    this.parameter = options.parameter;

    this.controlHandler = options.controlHandler;

    this.gateHandler = options.gateHandler;

    this.signal = options.signal;

    this.gateSignal = options.gateSignal;
  }
}
