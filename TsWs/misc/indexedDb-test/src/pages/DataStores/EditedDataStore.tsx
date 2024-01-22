export interface EditedDataStore {
  datastoreName: string;
  datastoreAutoIncrement: boolean;
  datastoreKeyPathStr: string;
  hasError?: boolean | null | undefined;
}
