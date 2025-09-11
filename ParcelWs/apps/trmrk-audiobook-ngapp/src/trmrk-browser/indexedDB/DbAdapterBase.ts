import { NullOrUndef, VoidOrAny } from '../../trmrk/core';
import { getDbObjName } from './core';

export abstract class DbAdapterBase {
  public readonly dbNameStr: string;

  constructor(
    public readonly dbName: string,
    public readonly appName: string,
    public version: number = 1
  ) {
    this.dbNameStr = this.getDbNameStr();
  }

  abstract onUpgradeNeeded(event: IDBVersionChangeEvent, db: IDBDatabase): void;

  getDbNameStr() {
    return getDbObjName([this.appName, this.dbName]);
  }

  open = (
    onSuccess:
      | ((event: Event, db: IDBDatabase) => VoidOrAny)
      | NullOrUndef = null,
    onError:
      | ((event: Event, error: DOMException | null) => VoidOrAny)
      | NullOrUndef = null
  ) => {
    const request = indexedDB.open(this.dbNameStr, this.version);

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

export class DbStoreAdapter {
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
