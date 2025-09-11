import { Subject, Observable, Subscription } from 'rxjs';

export class TrmrkObservable<T> {
  public readonly $obs: Observable<T>;

  private readonly subject: Subject<T>;
  private readonly subscriptions: Subscription[] = [];

  public get value(): T {
    return this._value;
  }

  constructor(private _value: T) {
    this.subject = new Subject<T>();
    this.$obs = this.subject.asObservable();
  }

  public next(value: T): void {
    this._value = value;
    this.subject.next(value);
  }

  public subscribe(callback: (value: T) => void) {
    const subscription = this.$obs.subscribe(callback);
    this.subscriptions.push(subscription);
    return subscription;
  }

  public unsubscribeAll() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }

    this.subscriptions.splice(0, this.subscriptions.length);
  }

  public [Symbol.dispose]() {
    this.unsubscribeAll();
  }
}
