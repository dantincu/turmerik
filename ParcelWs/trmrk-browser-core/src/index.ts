import * as core from "./core";

import * as idxedDB from "./indexedDB";

export const browser = {
  ...core,
  indexedDB: idxedDB.indexedDB,
};

export type TrmrkDBResp<T> = idxedDB.TrmrkDBRespType<T>;
