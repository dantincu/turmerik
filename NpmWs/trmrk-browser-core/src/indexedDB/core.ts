export interface TrmrkIdxedDBResp {
  db: IDBDatabase;
  event: Event;
}

export interface TrmrkDBStoreObjIdxOpts {
  name: string;
  keyPath: string | string[];
  unique?: boolean;
  dbOpts?: IDBIndexParameters;
}

export interface TrmrkDBStoreObjOpts {
  idxesArr: TrmrkDBStoreObjIdxOpts[];
}

export class TrmrkIdxedDB {
  openDb(
    dbName: string,
    version?: number | undefined,
    onupgradeneeded?: ((ev: IDBVersionChangeEvent) => any) | undefined,
    onblocked?: ((ev: IDBVersionChangeEvent) => any) | undefined
  ) {
    return new Promise<TrmrkIdxedDBResp>((resolve, reject) => {
      const dbReq = indexedDB.open(dbName, version);

      dbReq.onerror = (ev: Event) => {
        reject(ev);
      };

      dbReq.onupgradeneeded =
        onupgradeneeded ?? ((ev: IDBVersionChangeEvent) => reject(ev));

      dbReq.onblocked =
        onblocked ?? ((ev: IDBVersionChangeEvent) => reject(ev));

      dbReq.onsuccess = (ev: Event) =>
        resolve({
          db: (ev.target as any)?.result as IDBDatabase,
          event: ev,
        });
    });
  }

  createDBStore(
    db: IDBDatabase,
    objStName: string,
    keyPath: string,
    opts: TrmrkDBStoreObjOpts
  ) {
    const objSt = db.createObjectStore(objStName, {
      keyPath: keyPath,
    });

    for (let idx of opts.idxesArr) {
      const paramOpts = idx.dbOpts ?? {};
      paramOpts.unique ??= idx.unique ?? false;

      objSt.createIndex(idx.name, idx.keyPath, paramOpts);
    }
  }
}
