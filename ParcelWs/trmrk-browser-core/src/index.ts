import * as core from "./core";

import * as idxedDB from "./indexedDB";

export const browser = {
  ...core,
  indexedDB: idxedDB.indexedDB,
};

export type TrmrkIdxedDBType = idxedDB.TrmrkIdxedDBType;
export type TrmrkDBResp<T> = idxedDB.TrmrkDBRespType<T>;
export type IdxedDBInitOpts = idxedDB.IdxedDBInitOpts;
