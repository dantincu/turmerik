import { NullOrUndef } from './core';

export class SyncLock {
  private static readonly dfVal = BigInt(0);
  private static readonly incVal = BigInt(1);

  private readonly dfTimeout: number | undefined;
  private readonly syncRoot = new BigInt64Array(1);

  constructor(dfTimeout: number | NullOrUndef = undefined) {
    this.dfTimeout = dfTimeout ?? undefined;
  }

  public run(action: () => Promise<void>, timeout?: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (
        Atomics.add(this.syncRoot, 0, SyncLock.incVal) === SyncLock.dfVal ||
        Atomics.wait(
          this.syncRoot,
          0,
          SyncLock.dfVal,
          timeout ?? this.dfTimeout
        ) !== 'timed-out'
      ) {
        action().then(
          () => {
            Atomics.sub(this.syncRoot, 0, SyncLock.incVal);
            resolve();
          },
          (reason) => {
            Atomics.sub(this.syncRoot, 0, SyncLock.incVal);
            reject(reason);
          }
        );
      } else {
        reject(
          new Error(
            'While waiting for previously enqueued actions to finish their execution, more than the specified timeout has elapsed'
          )
        );
      }
    });
  }

  public get<T>(action: () => Promise<T>) {
    return new Promise<T>((resolve, reject) => {
      let retVal: T | null = null;

      this.run(
        () =>
          new Promise<void>((rslv, rjct) => {
            action().then((value) => {
              retVal = value;
              rslv();
            }, rjct);
          })
      ).then(() => {
        resolve(retVal!);
      }, reject);
    });
  }
}
