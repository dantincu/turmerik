import { NullOrUndef, VoidOrAny } from '../../trmrk/core';
import { mapPropNamesToThemselves } from '../../trmrk/propNames';

import { getDbObjName } from './core';

export const commonDbNamePrefixes = Object.freeze(
  mapPropNamesToThemselves({
    cache: '',
  })
);

export interface DbAdapterOpts {
  fullName?: string | string[] | NullOrUndef;
  dbName?: string | NullOrUndef;
  appName?: string | NullOrUndef;
  version?: number | NullOrUndef;
  dbNamePfx?: string | NullOrUndef;
  isCacheDb?: boolean | NullOrUndef;
  isSharedDb?: boolean | NullOrUndef;
}

export abstract class DbAdapterBase {
  public readonly dbNameStr: string;
  public readonly version: number;
  public readonly isSharedDb: boolean;

  constructor(opts: DbAdapterOpts) {
    this.dbNameStr = this.getDbNameStr(opts);
    this.version = opts.version ?? 1;
    this.isSharedDb = opts.isSharedDb ?? true;
  }

  abstract onUpgradeNeeded(event: IDBVersionChangeEvent, db: IDBDatabase): void;

  getDbNameStr(opts: DbAdapterOpts) {
    let dbNameStr: string;

    if ((opts.fullName ?? null) !== null) {
      if (typeof opts.fullName === 'string') {
        dbNameStr = opts.fullName;
      } else {
        dbNameStr = getDbObjName(opts.fullName!);
      }
    } else {
      dbNameStr = getDbObjName([
        opts.appName,
        opts.isCacheDb ? commonDbNamePrefixes.cache : null,
        opts.dbNamePfx,
        opts.dbName,
      ]);
    }

    return dbNameStr;
  }

  open = (
    onSuccess: ((event: Event, db: IDBDatabase) => VoidOrAny) | NullOrUndef = null,
    onError: ((event: Event, error: DOMException | null) => VoidOrAny) | NullOrUndef = null
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
