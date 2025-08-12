import { NullOrUndef } from '../../trmrk/core';
import { getDOMExceptionErrorMsg } from '../../trmrk-browser/domUtils/core';

export interface TrmrkDBResp<T> {
  data: T;
  cacheMatch: boolean;
  cacheError?: any | NullOrUndef;
}

export const getIDbRequestOpenErrorMsg = (error: DOMException | null): string =>
  getDOMExceptionErrorMsg(
    error,
    'Unknown error occurred while opening IndexedDB.'
  );

export const createDbStoreIfNotExists = (
  db: IDBDatabase,
  storeName: string,
  options?: IDBObjectStoreParameters | NullOrUndef
) => {
  let dbStore: IDBObjectStore | null = null;

  if (!db.objectStoreNames.contains(storeName)) {
    dbStore = db.createObjectStore(storeName, options ?? undefined);
  }

  return dbStore;
};
