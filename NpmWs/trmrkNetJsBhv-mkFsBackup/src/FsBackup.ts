import { IFsEntry, FsEntry } from "./FsEntry";
import { FsEntriesRetriever } from "./FsEntriesRetriever";

export interface IRuntimeData {
  dirSepStr: string;
  folderFsEntriesRetriever: (
    dirPath: string,
    dirSep: string
  ) => Promise<IFsEntry[]>;
}

export class FsBackupsManager {
  public runtimeData!: IRuntimeData | null;

  constructor() {}

  getFsEntriesRetriever(
    rootDirPath: string,
    forEachChildCallback: (
      item: FsEntry,
      idx: number,
      arr: FsEntry[]
    ) => Promise<void>
  ) {
    this.throwIfPropsNotInitialized();

    const fsEntriesRetriever = new FsEntriesRetriever(
      rootDirPath,
      "",
      this.runtimeData!.dirSepStr,
      this.runtimeData!.folderFsEntriesRetriever,
      forEachChildCallback
    );

    return fsEntriesRetriever;
  }

  throwIfPropsNotInitialized() {
    if (!this.runtimeData) {
      throw new Error(`The runtimeData must be set`);
    } else if (!this.runtimeData.folderFsEntriesRetriever) {
      throw new Error(`The runtimeData.folderFsEntriesRetriever must be set`);
    } else if (!this.runtimeData.dirSepStr) {
      throw new Error(`The runtimeData.dirSepStr must be set`);
    }
  }
}

export const fsBackupsManager = new FsBackupsManager();
