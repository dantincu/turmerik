import { NullOrUndef } from '../../trmrk/core';
import { getDOMExceptionErrorMsg } from '../../trmrk-browser/domUtils/core';

export interface ActiveDataItemCore {
  createdAtMillis: number;
  lastAccessedAtMillis: number;
}

export interface CachedItemCore {
  clientFetchTmStmpMillis: number;
}

export const getIDbRequestOpenErrorMsg = (error: DOMException | null): string =>
  getDOMExceptionErrorMsg(error, 'Unknown error occurred while opening IndexedDB.');

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

export const getDbObjName = (parts: (string | NullOrUndef)[]) =>
  parts
    .filter((part) => (part ?? null) !== null)
    .map((part) => `[${part}]`)
    .join('');

export interface DbResponse<T> {
  value: T;
  event: Event;
}

export const dbRequestToPromise = <T>(req: IDBRequest<T>) =>
  new Promise<DbResponse<T>>((resolve, reject) => {
    req.onsuccess = (event) => {
      const target = event.target as IDBRequest<T>;
      resolve({ value: target.result, event });
    };
    req.onerror = (event) => {
      const target = event.target as IDBRequest;
      reject(target.error);
    };
  });
