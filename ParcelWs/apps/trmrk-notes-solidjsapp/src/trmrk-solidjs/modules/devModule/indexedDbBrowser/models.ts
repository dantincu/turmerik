import {
  IDbDatabaseInfo,
  IDbObjectStoreInfo,
} from "../../../services/indexedDb/core";

export interface IndexedDbStore {
  id: number;
  dbStore: IDbObjectStoreInfo;
  canBeEdited: boolean;
  dbStoreNameHasError?: boolean | null | undefined;
  dbStoreKeyPathHasError?: boolean | null | undefined;
}

export interface IndexedDbDatabase {
  db: IDbDatabaseInfo;
}
