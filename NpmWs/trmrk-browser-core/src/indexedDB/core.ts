import { SyncLock } from "trmrk";

export interface TrmrkDBStoreObjIdxOpts {
  name: string;
  keyPath: string | string[];
  unique?: boolean;
  dbOpts?: IDBIndexParameters;
}

export interface TrmrkDBStoreObjOpts {
  idxesArr: TrmrkDBStoreObjIdxOpts[];
}

export interface TrmrkDBResp<T> {
  data: T;
  cacheMatch: boolean;
  cacheError: any;
}

export interface IdxedDBInitOpts {
  dbName: string;
  dbVersion?: number;
  onIdxedDBSuccess?: ((ev: Event, db: IDBDatabase) => any) | undefined;
  onIdxedDBerror?: ((ev: Event) => any) | undefined;
  onIdxedDBupgradeneeded?:
    | ((ev: IDBVersionChangeEvent, db: IDBDatabase) => Promise<IDBDatabase>)
    | undefined;
  onIdxedDBblocked?: ((ev: IDBVersionChangeEvent) => any) | undefined;
}

export class TrmrkIdxedDB {
  private readonly syncLock: SyncLock;

  private _db: IDBDatabase | null = null;

  dbName!: string;
  version?: number | undefined;
  onerror?: ((ev: Event) => any) | undefined;
  onupgradeneeded?:
    | ((ev: IDBVersionChangeEvent, db: IDBDatabase) => Promise<IDBDatabase>)
    | undefined;
  onblocked?: ((ev: IDBVersionChangeEvent) => any) | undefined;
  onsuccess?: ((ev: Event, db: IDBDatabase) => any) | undefined;

  constructor(dfTimeout: number | null | undefined = undefined) {
    this.syncLock = new SyncLock(dfTimeout);
  }

  init(opts: IdxedDBInitOpts) {
    this.dbName = opts.dbName;
    this.version = opts.dbVersion;
    this.onerror = opts.onIdxedDBerror;
    this.onupgradeneeded = opts.onIdxedDBupgradeneeded;
    this.onblocked = opts.onIdxedDBblocked;
    this.onsuccess = opts.onIdxedDBSuccess;
  }

  public getDb(dbVersion: number | null | undefined = null) {
    return this.syncLock.get<IDBDatabase>(
      () =>
        new Promise((resolve, reject) => {
          if (this._db) {
            resolve(this._db);
          } else {
            dbVersion ??= this.version;

            if (dbVersion === 0) {
              dbVersion = undefined;
            }

            const dbReq = indexedDB.open(this.dbName, dbVersion);

            this.reqOnSuccess(dbReq, resolve);
            this.reqOnError(dbReq, reject);
            this.reqOnBlocked(dbReq, reject);

            dbReq.onupgradeneeded = (ev: IDBVersionChangeEvent) => {
              if (this.onupgradeneeded) {
                const innerDbReq = indexedDB.open(this.dbName);

                this.reqOnSuccess(innerDbReq, resolve);
                this.reqOnError(innerDbReq, reject);
                this.reqOnBlocked(innerDbReq, reject);

                innerDbReq.onupgradeneeded = (ev: IDBVersionChangeEvent) => {
                  this.onblocked?.call(this, ev);
                  reject(ev);
                };
              } else {
                reject(ev);
              }
            };

            dbReq.onerror = (ev: Event) => {
              this.onerror?.call(this, ev);
              reject(ev);
            };

            dbReq.onblocked = (ev: IDBVersionChangeEvent) => {
              this.onblocked?.call(this, ev);
              reject(ev);
            };
          }
        })
    );
  }

  public async withDb<T>(
    action: (db: IDBDatabase) => TrmrkDBResp<T>,
    dbVersion: number | null | undefined = null
  ) {
    let resp: TrmrkDBResp<T>;

    try {
      var db = await this.getDb(dbVersion);
      resp = action(db);
    } catch (err: any) {
      resp = {
        cacheError: err,
      } as TrmrkDBResp<T>;
    }

    return resp;
  }

  private reqOnSuccess(
    dbReq: IDBOpenDBRequest,
    resolve: (db: IDBDatabase | PromiseLike<IDBDatabase>) => void
  ) {
    dbReq.onsuccess = (ev: Event) => {
      this._db = (ev.target as any).result as IDBDatabase;
      this.onsuccess?.call(this, ev, this._db);
      resolve(this._db);
    };
  }

  private reqOnError(dbReq: IDBOpenDBRequest, reject: (reason?: any) => void) {
    dbReq.onerror = (ev: Event) => {
      this.onerror?.call(this, ev);
      reject(ev);
    };
  }

  private reqOnBlocked(
    dbReq: IDBOpenDBRequest,
    reject: (reason?: any) => void
  ) {
    dbReq.onblocked = (ev: IDBVersionChangeEvent) => {
      this.onblocked?.call(this, ev);
      reject(ev);
    };
  }
}

export type TrmrkIdxedDBType = TrmrkIdxedDB;
export type TrmrkDBRespType<T> = TrmrkDBResp<T>;

export const createDBStore = (
  db: IDBDatabase,
  objStName: string,
  keyPath: string,
  opts: TrmrkDBStoreObjOpts
) => {
  const objSt = db.createObjectStore(objStName, {
    keyPath: keyPath,
  });

  for (let idx of opts.idxesArr) {
    const paramOpts = idx.dbOpts ?? {};
    paramOpts.unique ??= idx.unique ?? false;

    objSt.createIndex(idx.name, idx.keyPath, paramOpts);
  }

  return objSt;
};

export const getOrCreateDbStore = (
  db: IDBDatabase,
  objStNamesArr: DOMStringList,
  objStName: string,
  keyPath: string,
  opts: TrmrkDBStoreObjOpts
) => {
  if (!(objStName in objStNamesArr)) {
    createDBStore(db, objStName, keyPath, opts);
  }
};
