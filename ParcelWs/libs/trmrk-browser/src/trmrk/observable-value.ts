export class ObservableValue<T> implements Disposable {
  private __value: T;
  private listeners: ((newValue: T) => void)[];

  constructor(initialValue: T) {
    this.__value = initialValue;
    this.listeners = [];
  }

  public get value() {
    return this.__value;
  }

  public set value(newValue: T) {
    this.__value = newValue;

    for (let listener of this.listeners) {
      listener(newValue);
    }
  }

  public subscribe(listener: (newValue: T) => void) {
    this.listeners.push(listener);
  }

  public unsubscribe(listener: (newValue: T) => void) {
    const idx = this.listeners.indexOf(listener);

    if (idx >= 0) {
      this.listeners.splice(idx, 1);
    }

    return idx;
  }

  [Symbol.dispose] = () => {};
}
