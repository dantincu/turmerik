import { IFsEntry, FsEntry } from "./FsEntry";

export class FsEntriesRetriever {
  readonly rootPath: string;

  constructor(
    readonly rootParentPath: string,
    readonly rootDirName: string,
    readonly dirSepStr = "/",
    readonly folderFsEntriesRetriever: (
      dirPath: string,
      dirSep: string
    ) => Promise<IFsEntry[]>,
    readonly fsEntriesRetrieverFunc: (rootFolder: FsEntry) => void
  ) {
    this.rootPath = [rootParentPath, rootDirName].join(dirSepStr);
  }

  public run() {
    return new Promise<FsEntry>((resolve, reject) => {
      const rootFolder = new FsEntry(
        this.rootParentPath,
        this.rootDirName,
        this.dirSepStr,
        this.folderFsEntriesRetriever
      );

      rootFolder.resolved.push((rootFolder) => {
        resolve(rootFolder);
      });

      this.fsEntriesRetrieverFunc(rootFolder);
    });
  }
}
