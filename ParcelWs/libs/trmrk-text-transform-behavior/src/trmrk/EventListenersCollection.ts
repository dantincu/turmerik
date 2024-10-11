export class EventListenersCollection<TEvent> implements Disposable {
  protected readonly listenersArr: ((event: TEvent) => void)[];

  constructor(listenersArr?: ((event: TEvent) => void)[]) {
    this.listenersArr = [...(listenersArr ?? [])];
  }

  public subscribe(listener: (event: TEvent) => void) {
    this.listenersArr.push(listener);
  }

  public subscribeAll(listenersArr: ((event: TEvent) => void)[]) {
    for (let listener of listenersArr) {
      this.subscribe(listener);
    }
  }

  public unsubscribe(listener: (event: TEvent) => void) {
    const idx = this.listenersArr.indexOf(listener);

    if (idx >= 0) {
      this.listenersArr.splice(idx, 1);
    }

    return idx;
  }

  public unsubscribeAll(
    listenersArr?: ((event: TEvent) => void)[] | null | undefined
  ) {
    if (listenersArr) {
      for (let listener of listenersArr) {
        this.unsubscribe(listener);
      }
    } else {
      this.listenersArr.splice(0, this.listenersArr.length);
    }
  }

  public fireAll(event: TEvent) {
    for (let listener of this.listenersArr) {
      listener(event);
    }
  }

  [Symbol.dispose] = () => {
    this.unsubscribeAll();
  };
}
