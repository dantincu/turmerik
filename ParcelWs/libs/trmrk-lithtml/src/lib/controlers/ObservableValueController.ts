import { ReactiveController, ReactiveControllerHost } from "lit";

import { ObservableValue } from "../../trmrk/observable-value";

export abstract class ObservableValueControllerBase<T>
  implements ReactiveController
{
  host: ReactiveControllerHost;

  constructor(host: ReactiveControllerHost) {
    (this.host = host).addController(this);

    this.onValueChanged = this.onValueChanged.bind(this);
  }

  abstract get observable(): ObservableValue<T>;

  public get value() {
    return this.observable.value;
  }

  hostConnected() {
    this.observable.subscribe(this.onValueChanged);
  }

  hostDisconnected() {
    this.observable.unsubscribe(this.onValueChanged);
  }

  onValueChanged() {
    this.host.requestUpdate();
  }
}

export class ObservableValueController<
  T
> extends ObservableValueControllerBase<T> {
  __observable: ObservableValue<T>;

  constructor(
    host: ReactiveControllerHost,
    observableValue: ObservableValue<T>
  ) {
    super(host);
    this.__observable = observableValue;
  }

  public get observable() {
    return this.__observable;
  }

  public get value() {
    return this.observable.value;
  }

  public set value(value: T) {
    this.observable.value = value;
  }
}

export class ObservableValueSingletonControllerFactory<T>
  implements Disposable
{
  __observable: ObservableValue<T>;

  constructor(
    observableValue: ObservableValue<T> | null = null,
    initialValue: T | null = null
  ) {
    this.__observable =
      observableValue ?? new ObservableValue<T>(initialValue!);
  }

  public get observable() {
    return this.__observable;
  }

  public createController(host: ReactiveControllerHost) {
    return new ObservableValueController<T>(host, this.__observable);
  }

  [Symbol.dispose]() {
    this.__observable = null!;
  }
}
