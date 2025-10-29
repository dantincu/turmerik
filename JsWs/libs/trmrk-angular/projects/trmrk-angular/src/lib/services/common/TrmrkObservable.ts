import { Subject, Observable } from 'rxjs';

import { NullOrUndef } from '../../../trmrk/core';

export class TrmrkObservable<T> implements Disposable {
  private readonly $obs: Observable<T>;
  private readonly subject: Subject<T>;

  public get value(): T {
    return this._value;
  }

  constructor(private _value: T) {
    this.subject = new Subject<T>();
    this.$obs = this.subject.asObservable();
  }

  [Symbol.dispose]() {
    this.dispose();
  }

  dispose() {
    this.subject.unsubscribe();
    this._value = null!;
  }

  public next(
    value: T,
    onlyIfDifferent?: boolean | NullOrUndef,
    eqCompr?: ((prevVal: T, newVal: T) => boolean) | NullOrUndef
  ): void {
    let setValue = !onlyIfDifferent;

    if (!setValue) {
      eqCompr ??= (prevVal, newVal) => prevVal === newVal;
      setValue = !eqCompr(this._value, value);
    }

    if (setValue) {
      this._value = value;
      this.subject.next(value);
    }
  }

  public subscribe(callback: (value: T) => void) {
    const subscription = this.$obs.subscribe(callback);
    return subscription;
  }
}

export const runOnceWhenValueIs = async <TValue, TResult = any | void>(
  $obs: TrmrkObservable<TValue>,
  value: TValue,
  callback?: ((val: TValue) => TResult) | NullOrUndef,
  eqCompr?: ((refVal: TValue, trgVal: TValue) => boolean) | NullOrUndef
) =>
  new Promise<TResult>((resolve, reject) => {
    eqCompr ??= (ref, trg) => ref === trg;

    const onValueAvailable = (val: TValue) => {
      const matches = eqCompr!(val, value);

      if (matches) {
        try {
          if (callback) {
            const retVal = callback(val);
            resolve(retVal);
          } else {
            resolve(null!);
          }
        } catch (err) {
          reject(err);
        }
      }

      return matches;
    };

    if (!onValueAvailable($obs.value)) {
      const subscription = $obs.subscribe((val) => {
        if (onValueAvailable(val)) {
          subscription.unsubscribe();
        }
      });
    }
  });
