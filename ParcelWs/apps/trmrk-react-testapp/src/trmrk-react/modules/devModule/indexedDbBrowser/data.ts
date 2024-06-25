import {
  IDbDatabaseInfo,
  IDbObjectStoreInfo,
} from "../../../services/indexedDb";

export interface IndexedDbTrmrkTreeNodeDataValue {
  dbInfo: IDbDatabaseInfo;
}

export interface IndexedDbStoreTrmrkTreeNodeDataValue {
  dbStoreInfo: IDbObjectStoreInfo;
}

export const searchQuery = Object.freeze({
  dbName: "db-name",
  showCreateSuccessMsg: "show-create-success-msg",
});
