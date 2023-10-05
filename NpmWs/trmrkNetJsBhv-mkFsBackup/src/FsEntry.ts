import { forEach } from "trmrk";

export interface IFsEntry {
  name: string;
  isFolder: boolean;
}

export const retrieveFsEntries = async (
  parent: FsEntry | null,
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
        parent,
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

  public fsPath: string | null;

  private readonly folderFsEntriesRetriever: (
    dirPath: string,
    dirSep: string
  ) => Promise<IFsEntry[]>;

  private childrenCount = -1;
  private resolvedChildrenCount = -1;

  constructor(
    public readonly parent: FsEntry | null,
    public readonly parentDirPath: string,
    public readonly name: string,
    public readonly dirSepStr = "/",
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

  public isRootFolder() {
    const isRootFolder = !this.parent;
    return isRootFolder;
  }

  public isRootLevel() {
    const isRootLevel = this.parent.isRootFolder;
    return isRootLevel;
  }

  public async forEachChild(
    callback: (item: FsEntry, idx: number, arr: FsEntry[]) => Promise<void>
  ) {
    await this.assureChildrenRetrieved();

    for (let i = 0; i < this.childNodes.length; i++) {
      await callback(this.childNodes[i], i, this.childNodes);
    }
  }

  public async include(depth = 0) {
    this.isIncluded = true;
    this.isExcluded = false;

    let resolve = !this.isFolder;

    if (!resolve) {
      if (depth > 0) {
        const nextDepth = depth - 1;

        await this.forEachChild(async (item) => {
          await item.include(nextDepth);
        });
      } else {
        await this.assureChildrenRetrieved();
      }

      resolve = depth >= 0 && this.childrenCount === 0;
    }

    if (this.parent && !this.parent.isIncluded) {
      this.parent.include(depth);
    }

    if (resolve) {
      this.resolveIfReq();
    }
  }

  public exclude() {
    this.isExcluded = true;
    this.isIncluded = false;

    this.resolveIfReq();
  }

  public excludeUnresolved() {
    if (!this.isResolved) {
      if (!this.isFolder) {
        this.exclude();
      } else {
        if (this.resolvedChildrenCount > 0) {
          forEach(this.childNodes, (childItem) => {
            if (!childItem.isResolved) {
              childItem.exclude();
            }
          });
        } else if (!this.isIncluded) {
          this.exclude();
        } else {
          this.resolveIfReq();
        }
      }
    }
  }

  private async retrieveChildren(): Promise<[FsEntry[], number]> {
    this.fsPath ??= [this.parentDirPath, this.name].join(this.dirSepStr);

    const childNodes = await retrieveFsEntries(
      this,
      this.fsPath,
      this.dirSepStr,
      this.folderFsEntriesRetriever
    );

    forEach(childNodes, (item) => {
      item.resolved.push(() => {
        this.resolvedChildrenCount++;

        if (this.resolvedChildrenCount >= this.childrenCount) {
          this.resolveIfReq();
        }
      });
    });

    return [childNodes, childNodes.length];
  }

  private async assureChildrenRetrieved() {
    if (!this.childNodes) {
      const [childNodes, childrenCount] = await this.retrieveChildren();

      this.childNodes = childNodes;
      this.childrenCount = childrenCount;
      this.resolvedChildrenCount = 0;
    }
  }

  private resolveIfReq() {
    const resolve = !this.isResolved;

    if (resolve) {
      this.resolve();
    }

    return resolve;
  }

  private resolve() {
    this.isResolved = true;
    this.onResolved();
  }

  private onResolved() {
    for (let subscription of this.resolved) {
      subscription(this);
    }
  }
}
