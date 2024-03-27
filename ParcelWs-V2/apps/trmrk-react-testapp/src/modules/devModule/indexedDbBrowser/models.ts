export interface IndexedDbStore {
  dbStoreName: string;
  keyPath: string;
  autoIncrement: boolean;
  dbStoreNameHasError?: boolean | null | undefined;
  dbStoreKeyPathHasError?: boolean | null | undefined;
}

export interface IndexedDbDatabase {
  dbName: string;
}
