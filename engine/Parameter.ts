export type ParameterType = "number" | "enum";

type Listener<T> = (value: T) => void;

export class Parameter<T> {
  public readonly id: string;

  public readonly name: string;

  public readonly type: ParameterType;

  public value: T;

  public readonly min?: number;

  public readonly max?: number;

  public readonly step?: number;

  public readonly options?: T[];

  private listeners: Listener<T>[] = [];

  constructor(options: {
    id: string;
    name: string;
    type: ParameterType;
    value: T;
    min?: number;
    max?: number;
    step?: number;
    options?: T[];
  }) {
    this.id = options.id;
    this.name = options.name;
    this.type = options.type;
    this.value = options.value;
    this.min = options.min;
    this.max = options.max;
    this.step = options.step;
    this.options = options.options;
  }

  setValue(value: T) {
    this.value = value;

    for (const listener of this.listeners) {
      listener(value);
    }
  }

  onChange(callback: Listener<T>): () => void {
    this.listeners.push(callback);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }
}
