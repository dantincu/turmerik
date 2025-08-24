import { NullOrUndef, AnyOrUnknown } from '../../trmrk/core';
import { getDOMExceptionErrorMsg } from '../../trmrk-browser/domUtils/core';

export interface TrmrkDBResp<T> {
  data: T;
  cacheMatch: boolean;
  cacheError?: AnyOrUnknown;
}

export const getIDbRequestOpenErrorMsg = (error: DOMException | null): string =>
  getDOMExceptionErrorMsg(
    error,
    'Unknown error occurred while opening IndexedDB.'
  );

export const createDbStoreIfNotExists = (
  db: IDBDatabase,
  storeName: string,
  optionsFactory?: (() => IDBObjectStoreParameters) | NullOrUndef
) => {
  let dbStore: IDBObjectStore | null = null;

  if (!db.objectStoreNames.contains(storeName)) {
    const options = optionsFactory ? optionsFactory() : undefined;
    dbStore = db.createObjectStore(storeName, options);
  }

  return dbStore;
};

export const getDbObjName = (parts: string[]) =>
  parts.map((part) => `[${part}]`).join('');
