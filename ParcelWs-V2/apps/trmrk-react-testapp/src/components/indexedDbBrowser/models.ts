export interface IndexedDbStore {
  dbStoreName: string;
  hasError?: boolean | null | undefined;
}

export interface IndexedDbDatabase {
  dbName: string;
}
