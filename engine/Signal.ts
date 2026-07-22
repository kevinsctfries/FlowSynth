export class Signal<T> {
  private listeners: ((value: T) => void)[] = [];

  private hasValue = false;

  private lastValue!: T;

  constructor(initial?: T) {
    if (initial !== undefined) {
      this.hasValue = true;
      this.lastValue = initial;
    }
  }

  subscribe(callback: (value: T) => void) {
    this.listeners.push(callback);

    if (this.hasValue) {
      callback(this.lastValue);
    }

    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback,
      );
    };
  }

  emit(value: T) {
    this.hasValue = true;
    this.lastValue = value;

    for (const listener of this.listeners) {
      listener(value);
    }
  }
}

export type ControlSignal = Signal<number>;

export type GateSignal = Signal<boolean>;
