import { IDbIndexInfo, IDbObjectStoreInfo } from "../../services/indexedDb";

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
  hasError: boolean | null | undefined;
}
