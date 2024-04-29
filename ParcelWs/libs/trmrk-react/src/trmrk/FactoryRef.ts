export class FactoryRef<T> {
  private _factory: (() => T) | null;

  constructor() {
    this._factory = null;
  }

  public get factory() {
    if (!this._factory) {
      throw new Error("There is no factory registered");
    }

    return this._factory;
  }

  public get isRegistered() {
    return !!this.factory;
  }

  public register(factory: () => T) {
    this._factory = factory;
  }

  public unregister() {
    this._factory = null;
  }
}

export class ValueRetriever<TOut, TIn> {
  public readonly factoryRef: FactoryRef<TOut>;

  constructor(public readonly inputVal: TIn) {
    this.factoryRef = new FactoryRef<TOut>();
  }

  public get value() {
    const retVal = this.factoryRef.factory();
    return retVal;
  }
}
