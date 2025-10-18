import { AnyOrUnknown, NullOrUndef } from '../../trmrk/core';
import { getDOMExceptionErrorMsg } from '../../trmrk-browser/domUtils/core';

export interface DbStoreDefinitionCore {
  name: string;
  keyPath: string | string[];
}

export interface DbStoreDefinition extends DbStoreDefinitionCore {
  indexes?: { [name: string]: DbStoreDefinitionCore } | NullOrUndef;
}

export interface ActiveDataItemCore {
  createdAtMillis: number;
  lastAccessedAtMillis: number;
}

export interface CachedItemCore {
  clientFetchTmStmpMillis: number;
}

export const sortCachedItems = <TCachedItem extends CachedItemCore>(
  cachedItemsArr: TCachedItem[]
) => {
  cachedItemsArr.sort((a, b) => (a.clientFetchTmStmpMillis >= b.clientFetchTmStmpMillis ? -1 : 0));
  return cachedItemsArr;
};

export const getIDbRequestOpenErrorMsg = (error: DOMException | null): string =>
  getDOMExceptionErrorMsg(error, 'Unknown error occurred while opening IndexedDB.');

export const createDbStoreIfNotExists = (
  db: IDBDatabase,
  storeName: string,
  optionsFactory?: (() => IDBObjectStoreParameters) | NullOrUndef,
  callback?: (store: IDBObjectStore) => AnyOrUnknown
) => {
  let dbStore: IDBObjectStore | null = null;

  if (!db.objectStoreNames.contains(storeName)) {
    const options = optionsFactory ? optionsFactory() : undefined;
    dbStore = db.createObjectStore(storeName, options);

    if (callback) {
      callback(dbStore);
    }
  }

  return dbStore;
};

export const createIndexIfNotExists = (
  dbStore: IDBObjectStore,
  indexName: string,
  keyPath: string | string[],
  optionsFactory?: (() => IDBIndexParameters) | NullOrUndef
) => {
  let index: IDBIndex = null!;

  if (!dbStore.indexNames.contains(indexName)) {
    const options = optionsFactory ? optionsFactory() : undefined;
    index = dbStore.createIndex(indexName, keyPath, options);
  } else {
    index = dbStore.index(indexName);
  }

  return index;
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

export const openDbRequestToPromise = (req: IDBOpenDBRequest) =>
  new Promise<DbResponse<IDBDatabase>>((resolve, reject) => {
    req.onsuccess = (event) => {
      const target = event.target as IDBOpenDBRequest;
      resolve({ value: target.result, event });
    };
    req.onerror = (event) => {
      const target = event.target as IDBRequest;
      reject(target.error);
    };
    req.onblocked = (event) => {
      const target = event.target as IDBRequest;
      reject(target.error);
    };
  });
