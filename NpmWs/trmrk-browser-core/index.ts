import * as core from "./src/core";

import * as idxedDB from "./src/indexedDB";

export const browser = {
  ...core,
  indexedDB: idxedDB.indexedDB,
};

export type TrmrkIdxedDBType = idxedDB.TrmrkIdxedDBType;
export type TrmrkDBResp<T> = idxedDB.TrmrkDBRespType<T>;
export type IdxedDBInitOpts = idxedDB.IdxedDBInitOpts;
