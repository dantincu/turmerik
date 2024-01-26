import { v4 as uuidv4 } from "uuid";

import trmrk from "trmrk";

import {
  IDbIndexInfo,
  IDbObjectStoreInfo,
  getObjectStoresInfoAgg,
  getObjectStoreInfo,
} from "./indexedDb";

export interface EditedDbIndex extends IDbIndexInfo {}

export class EditedDbObjectStoreFactory {
  readonly factories: (() => EditedDbObjectStore)[];

  constructor() {
    this.factories = [];
  }

  public subscribe(factory: () => EditedDbObjectStore) {
    this.factories.push(factory);
  }

  public unsubscribe(factory: () => EditedDbObjectStore) {
    const kvp = trmrk.findKvp(this.factories, (fact, idx) => fact === factory);

    if (kvp.key >= 0) {
      this.factories.splice(kvp.key, 1);
    }

    return kvp.key;
  }
}

export interface EditedDbObjectStore extends IDbObjectStoreInfo {
  keyPathStr: string;
  editedIndexes: EditedDbIndex[];
  uuid: string;
  isDeleted: boolean | null | undefined;
  hasError: boolean | null | undefined;
  dataFactory: EditedDbObjectStoreFactory;
}

export interface EditedDatabase {
  databaseName: string;
  databaseVersion: number | null | undefined;
  datastores: IDbObjectStoreInfo[];
}

export class EditedDbObjectStoreImpl implements EditedDbObjectStore {
  constructor(src: EditedDbObjectStore) {
    this.dataFactory = new EditedDbObjectStoreFactory();
    this.storeName = src.storeName;
    this.autoIncrement = src.autoIncrement;
    this.keyPath = src.keyPath;
    this.indexNames = src.indexNames;
    this.indexes = src.indexes;
    this.keyPathStr = src.keyPathStr;
    this.editedIndexes = src.editedIndexes;
    this.uuid = src.uuid;
    this.isDeleted = src.isDeleted;
    this.hasError = src.hasError;
  }

  readonly dataFactory: EditedDbObjectStoreFactory;

  storeName: string;
  autoIncrement: boolean;
  keyPath: string | string[];
  indexNames: string[];
  indexes: IDbIndexInfo[];

  keyPathStr: string;
  editedIndexes: EditedDbIndex[];
  uuid: string;
  isDeleted: boolean | null | undefined;
  hasError: boolean | null | undefined;
}

export const convertObjectStore = (store: IDbObjectStoreInfo) =>
  new EditedDbObjectStoreImpl({
    ...store,
    uuid: uuidv4(),
  } as EditedDbObjectStore);

export const mapObjectStoresAgg = (stores: IDbObjectStoreInfo[]) =>
  stores.map((store) => convertObjectStore(store));

export const getObjectStore = (objStore: IDBObjectStore) => {
  const store = getObjectStoreInfo(objStore);
  const retStore = convertObjectStore(store);
  return retStore;
};

export const getObjectStoresAgg = (db: IDBDatabase) => {
  const storesArr = getObjectStoresInfoAgg(db);
  const retStores = mapObjectStoresAgg(storesArr);

  return retStores;
};

export const normalizeKeyPath = (
  keyPath: string | string[] | null | undefined
) => {
  let normKeyPath = keyPath;

  if (typeof normKeyPath === "string") {
    normKeyPath = [normKeyPath];
  } else if (!(normKeyPath ?? false)) {
    normKeyPath = [];
  }

  return normKeyPath as string[];
};
