import { NullOrUndef, VoidOrAny } from '../../trmrk/core';

export abstract class IDbAdapterBase {
  constructor(public readonly dbName: string, public version: number = 1) {}

  abstract onUpgradeNeeded(event: IDBVersionChangeEvent, db: IDBDatabase): void;

  open = (
    onSuccess:
      | ((event: Event, db: IDBDatabase) => VoidOrAny)
      | NullOrUndef = null,
    onError:
      | ((event: Event, error: DOMException | null) => VoidOrAny)
      | NullOrUndef = null
  ) => {
    const request = indexedDB.open(this.dbName, this.version);

    request.onupgradeneeded = (event) => {
      const target = event.target as IDBOpenDBRequest;
      this.onUpgradeNeeded(event, target.result);
    };

    if (onSuccess) {
      request.onsuccess = (event) => {
        const target = event.target as IDBOpenDBRequest;
        onSuccess(event, target.result);
      };
    }

    if (onError) {
      request.onerror = (event) => {
        const target = event.target as IDBOpenDBRequest;
        onError(event, target?.error ?? null);
      };

      /* onError(
        {} as Event,
        {
          name: 'asdfasdf',
          message: 'This is a test error',
        } as DOMException
      ); */
    }

    return request;
  };
}

export class IDbStoreAdapter {
  constructor(public readonly dbStoreName: string) {}

  store(
    db: IDBDatabase | null = null,
    tran: IDBTransaction | null = null,
    mode: 'readonly' | 'readwrite' | 'versionchange' = 'readonly',
    options?: IDBTransactionOptions
  ): IDBObjectStore {
    tran ??= db!.transaction(this.dbStoreName, mode, options);
    return tran.objectStore(this.dbStoreName);
  }
}
