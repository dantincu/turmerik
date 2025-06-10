import { Subject, Observable } from 'rxjs';

export class TrmrkObservable<T> {
  private subject: Subject<T>;

  public $obs: Observable<T>;

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
}
