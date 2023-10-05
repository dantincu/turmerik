import { forEach } from "trmrk";

export interface IFsEntry {
  name: string;
  isFolder: boolean;
}

export const retrieveFsEntries = async (
  parentDirPath: string,
  dirSepStr: string,
  folderFsEntriesRetriever: (
    dirPath: string,
    dirSep: string
  ) => Promise<IFsEntry[]>
) => {
  const childEntriesArr = await folderFsEntriesRetriever(
    parentDirPath,
    dirSepStr
  );

  const childNodes = childEntriesArr.map(
    (entry) =>
      new FsEntry(
        parentDirPath,
        entry.name,
        dirSepStr,
        entry.isFolder ? folderFsEntriesRetriever : null
      )
  );

  return childNodes;
};

export class FsEntry implements IFsEntry {
  public readonly isFolder: boolean;
  public childNodes: FsEntry[] | null;

  public isIncluded = false;
  public isExcluded = false;
  public isResolved = false;

  public resolved: ((fsEntry: FsEntry) => void)[] = [];

  private readonly folderFsEntriesRetriever: (
    dirPath: string,
    dirSep: string
  ) => Promise<IFsEntry[]>;

  private childrenCount = 0;
  private resolvedChildrenCount = 0;

  constructor(
    public parentDirPath: string,
    public readonly name: string,
    readonly dirSepStr = "/",
    folderFsEntriesRetriever:
      | ((dirPath: string, dirSep: string) => Promise<IFsEntry[]>)
      | null
  ) {
    this.isFolder = !!folderFsEntriesRetriever;
    this.childNodes = null;

    this.folderFsEntriesRetriever =
      folderFsEntriesRetriever ??
      (async () => {
        throw new Error("Calling this method on a file entry is not allowed");
      });
  }

  public async forEachChild(
    callback: (item: FsEntry, idx: number, arr: FsEntry[]) => void
  ) {
    await this.assureChildrenRetrieved();
    forEach(this.childNodes, callback);
  }

  public exclude() {
    const wasResolved = this.isResolved;

    this.isExcluded = true;
    this.isIncluded = false;
    this.isResolved = true;

    if (!wasResolved) {
      this.onResolved();
    }
  }

  public async include(depth = 0) {
    const wasResolved = this.isResolved;

    this.isIncluded = true;
    this.isExcluded = false;

    if (this.isFolder) {
      if (depth > 0) {
        const nextDepth = depth - 1;

        await this.forEachChild((item) => {
          item.include(nextDepth);
        });
      } else {
        await this.assureChildrenRetrieved();
      }

      if (this.childrenCount === 0) {
        this.isResolved = true;
        this.onResolved();
      }
    } else {
      if (!wasResolved) {
        this.isResolved = true;
        this.onResolved();
      }
    }
  }

  private async retrieveChildren(): Promise<[FsEntry[], number]> {
    const dirPath = [this.parentDirPath, this.name].join(this.dirSepStr);

    const childNodes = await retrieveFsEntries(
      dirPath,
      this.dirSepStr,
      this.folderFsEntriesRetriever
    );

    forEach(childNodes, (item) => {
      item.resolved.push(() => {
        let keepIterating = true;
        this.resolvedChildrenCount++;

        if (this.resolvedChildrenCount >= this.childrenCount) {
          this.onResolved();
          keepIterating = false;
        }

        return keepIterating;
      });
    });

    return [childNodes, childNodes.length];
  }

  private async assureChildrenRetrieved() {
    if (!this.childNodes) {
      const [childNodes, childrenCount] = await this.retrieveChildren();

      this.childNodes = childNodes;
      this.childrenCount = childrenCount;
    }
  }

  private onResolved() {
    for (let subscription of this.resolved) {
      subscription(this);
    }
  }
}
