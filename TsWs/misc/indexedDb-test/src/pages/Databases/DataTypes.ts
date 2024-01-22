import { IDbIndexInfo, IDbObjectStoreInfo } from "../../services/indexedDb";

export interface EditedDbIndex extends IDbIndexInfo {}

export interface EditedDbObjectStore extends IDbObjectStoreInfo {
  keyPathStr: string;
  editedIndexes: EditedDbIndex[];
  hasError: boolean | null | undefined;
}

export interface EditedDatabase {
  databaseName: string;
  databaseVersion: number | null | undefined;
  datastores: EditedDbObjectStore[];
}
