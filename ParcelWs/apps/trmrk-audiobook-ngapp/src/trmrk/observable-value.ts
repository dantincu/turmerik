import { EventListenersCollection } from './EventListenersCollection';

export class ObservableValue<T> extends EventListenersCollection<T> {
  private __value: T;

  constructor(initialValue: T, listenersArr?: ((event: T) => void)[]) {
    super(listenersArr);
    this.__value = initialValue;
  }

  public get value() {
    return this.__value;
  }

  public set value(newValue: T) {
    this.__value = newValue;
    this.fireAll(newValue);
  }

  override [Symbol.dispose] = () => {
    super[Symbol.dispose]();
    this.value = null!;
  };
}
