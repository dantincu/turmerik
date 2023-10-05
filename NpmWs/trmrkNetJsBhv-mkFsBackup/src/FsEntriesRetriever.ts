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
    readonly forEachChildCallback: (
      item: FsEntry,
      idx: number,
      arr: FsEntry[]
    ) => Promise<void>
  ) {
    this.rootPath = [rootParentPath, rootDirName].join(dirSepStr);
  }

  public async run() {
    return new Promise<FsEntry>((resolve, reject) => {
      const rootFolder = new FsEntry(
        null,
        this.rootParentPath,
        this.rootDirName,
        this.dirSepStr,
        this.folderFsEntriesRetriever
      );

      let resolved = false;

      rootFolder.resolved.push((rootFolder) => {
        if (!resolved) {
          resolved = true;
          resolve(rootFolder);
        }
      });

      rootFolder.forEachChild(this.forEachChildCallback).then(
        () => {
          if (!resolved) {
            resolved = true;
            resolve(rootFolder);
          }
        },
        (reason) => reject(reason)
      );
    });
  }
}
