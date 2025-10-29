import { Subject, Observable } from 'rxjs';

export class TrmrkBufferedObservable<T> implements Disposable {
  private readonly $obs: Observable<T>;
  private readonly subject: Subject<T>;

  public get buffer(): T[] {
    return this._buffer;
  }

  constructor(private _buffer: T[], public useBuffer: boolean = true) {
    this.subject = new Subject<T>();
    this.$obs = this.subject.asObservable();
  }

  [Symbol.dispose]() {
    this.dispose();
  }

  dispose() {
    this.subject.unsubscribe();
    this._buffer = null!;
  }

  public next(value: T): void {
    if (this.useBuffer) {
      this._buffer.push(value);
    }

    this.subject.next(value);
  }

  public subscribe(callback: (value: T) => void) {
    const subscription = this.$obs.subscribe(callback);
    return subscription;
  }
}
