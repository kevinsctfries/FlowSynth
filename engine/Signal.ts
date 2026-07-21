export class ControlSignal {
  private listeners: ((value: number) => void)[] = [];

  subscribe(callback: (value: number) => void) {
    this.listeners.push(callback);

    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback,
      );
    };
  }

  emit(value: number) {
    for (const listener of this.listeners) {
      listener(value);
    }
  }
}
