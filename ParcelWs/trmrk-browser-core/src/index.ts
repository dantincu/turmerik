import * as core from "./core";

import * as idxedDB from "./indexedDB";
import * as fsApi from "./fsApi";

export const browser = {
  ...core,
  indexedDB: idxedDB.indexedDB,
  fsApi: fsApi.fsApi,
};

export type TrmrkDBResp<T> = idxedDB.TrmrkDBRespType<T>;
