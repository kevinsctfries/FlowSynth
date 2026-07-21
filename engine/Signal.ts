export class Signal<T> {
  private listeners: ((value: T) => void)[] = [];

  subscribe(callback: (value: T) => void) {
    this.listeners.push(callback);

    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback,
      );
    };
  }

  emit(value: T) {
    for (const listener of this.listeners) {
      listener(value);
    }
  }
}

export type ControlSignal = Signal<number>;

export type GateSignal = Signal<boolean>;
