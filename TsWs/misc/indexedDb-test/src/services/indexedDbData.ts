import { v4 as uuidv4 } from "uuid";

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
    const idx = this.factories.findIndex(factory);

    if (idx >= 0) {
      this.factories.splice(idx, 1);
    }

    return idx;
  }
}

export interface EditedDbObjectStore extends IDbObjectStoreInfo {
  keyPathStr: string;
  editedIndexes: EditedDbIndex[];
  uuid: string;
  isDeleted: boolean | null | undefined;
  hasError: boolean | null | undefined;
  dataFactory: EditedDbObjectStoreFactory;
  onRemoved: () => void;
}

export interface EditedDatabase {
  databaseName: string;
  databaseVersion: number | null | undefined;
  datastores: IDbObjectStoreInfo[];
}

export class EditedDbObjectStoreImpl implements EditedDbObjectStore {
  constructor(src: EditedDbObjectStore) {
    this.dataFactory = new EditedDbObjectStoreFactory();
    this.onRemoved = src.onRemoved;
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
  onRemoved: () => void;

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

export const convertObjectStore = (
  store: IDbObjectStoreInfo,
  removeStore: (store: EditedDbObjectStore) => void
) => {
  const retStore: EditedDbObjectStore = new EditedDbObjectStoreImpl({
    ...store,
    uuid: uuidv4(),
    onRemoved: () => removeStore(retStore),
  } as EditedDbObjectStore);

  return retStore;
};

export const mapObjectStoresAgg = (
  stores: IDbObjectStoreInfo[],
  removeStore: (store: EditedDbObjectStore) => void
) => stores.map((store) => convertObjectStore(store, removeStore));

export const getObjectStore = (
  objStore: IDBObjectStore,
  removeStore: (store: EditedDbObjectStore) => void
) => {
  const store = getObjectStoreInfo(objStore);
  const retStore = convertObjectStore(store, removeStore);
  return retStore;
};

export const getObjectStoresAgg = (
  db: IDBDatabase,
  removeStore: (store: EditedDbObjectStore) => void
) => {
  const storesArr = getObjectStoresInfoAgg(db);
  const retStores = mapObjectStoresAgg(storesArr, removeStore);

  return retStores;
};
