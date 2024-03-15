export interface IndexedDbStore {
  dbStoreName: string;
  keyPath: string;
  autoIncrement: boolean;
  hasError?: boolean | null | undefined;
}

export interface IndexedDbDatabase {
  dbName: string;
}
