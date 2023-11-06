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
  onIdxedDBupgradeneeded?: ((ev: IDBVersionChangeEvent) => any) | undefined;
  onIdxedDBblocked?: ((ev: IDBVersionChangeEvent) => any) | undefined;
}

export class TrmrkIdxedDB {
  private _dbReq: IDBOpenDBRequest | null = null;
  private _db: IDBDatabase | null = null;

  dbName!: string;
  version?: number | undefined;
  onerror?: ((ev: Event) => any) | undefined;
  onupgradeneeded?: ((ev: IDBVersionChangeEvent) => any) | undefined;
  onblocked?: ((ev: IDBVersionChangeEvent) => any) | undefined;
  onsuccess?: ((ev: Event, db: IDBDatabase) => any) | undefined;

  init(opts: IdxedDBInitOpts) {
    this.dbName = opts.dbName;
    this.version = opts.dbVersion;
    this.onerror = opts.onIdxedDBerror;
    this.onupgradeneeded = opts.onIdxedDBupgradeneeded;
    this.onblocked = opts.onIdxedDBblocked;
    this.onsuccess = opts.onIdxedDBSuccess;
  }

  getDb() {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const db = this._db;

      if (db) {
        resolve(db);
      } else {
        let dbReq = this._dbReq;

        if (!dbReq) {
        } else {
          dbReq = indexedDB.open(this.dbName, this.version);
          this._dbReq = dbReq;

          dbReq.onsuccess = (ev: Event) => {
            const db = (ev.target as any).result as IDBDatabase;
            this._db = db;
            this._dbReq = null;
            this.onsuccess?.call(this, ev, db);
            resolve(db);
          };

          dbReq.onerror = (ev: Event) => {
            this._dbReq = null;
            this.onerror?.call(this, ev);
            reject(ev);
          };

          dbReq.onupgradeneeded = (ev: IDBVersionChangeEvent) => {
            this._dbReq = null;
            this.onupgradeneeded?.call(this, ev);
            reject(ev);
          };

          dbReq.onblocked = (ev: IDBVersionChangeEvent) => {
            this._dbReq = null;
            this.onblocked?.call(this, ev);
            reject(ev);
          };
        }
      }
    });
  }

  async withDb<T>(action: (db: IDBDatabase) => TrmrkDBResp<T>) {
    let resp: TrmrkDBResp<T>;

    try {
      var db = await this.getDb();
      resp = action(db);
    } catch (err: any) {
      resp = {
        cacheError: err,
      } as TrmrkDBResp<T>;
    }

    return resp;
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
