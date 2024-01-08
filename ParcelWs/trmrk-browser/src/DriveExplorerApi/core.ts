import { core as trmrk } from "trmrk";

import { DriveItem, FileType, OfficeFileType } from "trmrk/src/drive-item";

export interface IDriveItemNodeCore<
  TDriveItemNode extends IDriveItemNodeCore<TDriveItemNode>
> {
  item: DriveItem;
  name: string;
  isFolder: boolean;

  subFolders?: TDriveItemNode[] | null | undefined;
  folderFiles?: TDriveItemNode[] | null | undefined;
}

export class DriveItemNodeCore<
  TDriveItemNode extends IDriveItemNodeCore<TDriveItemNode>
> implements IDriveItemNodeCore<TDriveItemNode>
{
  private readonly _item: DriveItem;
  private readonly _name: string;
  private readonly _isFolder: boolean;

  private readonly _subFolders?: TDriveItemNode[] | null | undefined;
  private readonly _folderFiles?: TDriveItemNode[] | null | undefined;

  constructor(item: DriveItem) {
    this._item = item;

    this._name = this._item.name;
    this._isFolder = this._item.isFolder ?? false;
  }

  public get item(): DriveItem {
    return this._item;
  }

  public get name(): string {
    return this._name;
  }

  public get isFolder(): boolean {
    return this._isFolder;
  }

  public get subFolders(): TDriveItemNode[] | null | undefined {
    return this._subFolders;
  }

  public get folderFiles(): TDriveItemNode[] | null | undefined {
    return this._folderFiles;
  }
}

export interface IDriveExplorerApi {
  GetItem: (path: string) => Promise<DriveItem | null>;
  GetFolder: (path: string) => Promise<DriveItem | null>;
  ItemExists: (path: string) => Promise<boolean>;
  FolderExists: (path: string) => Promise<boolean>;
  FileExists: (path: string) => Promise<boolean>;
  GetFileText: (path: string) => Promise<string | null>;
  GetDriveFolderWebUrl: (path: string) => Promise<string | null>;
  GetDriveFileWebUrl: (path: string) => Promise<string | null>;
  CreateFolder: (
    prPath: string,
    newFolderName: string
  ) => Promise<DriveItem | null>;
  RenameFolder: (
    path: string,
    newFolderName: string
  ) => Promise<DriveItem | null>;
  CopyFolder: (
    path: string,
    newPrPath: string,
    newFolderName: string | null
  ) => Promise<DriveItem | null>;
  MoveFolder: (
    path: string,
    newPrPath: string,
    newFolderName: string | null
  ) => Promise<DriveItem | null>;
  DeleteFolder: (path: string) => Promise<DriveItem | null>;
  CreateTextFile: (
    prPath: string,
    newFileName: string,
    text: string
  ) => Promise<DriveItem | null>;
  CreateOfficeLikeFile: (
    prPath: string,
    newFileName: string,
    officeLikeFileType: OfficeFileType
  ) => Promise<DriveItem | null>;
  RenameFile: (path: string, newFileName: string) => Promise<DriveItem | null>;
  CopyFile: (
    path: string,
    newPrPath: string,
    newFileName: string | null
  ) => Promise<DriveItem | null>;
  MoveFile: (
    path: string,
    newPrPath: string,
    newFileName: string | null
  ) => Promise<DriveItem | null>;
  DeleteFile: (path: string) => Promise<DriveItem | null>;
}

export abstract class DriveExplorerApiBase<
  TDriveItemNode extends IDriveItemNodeCore<TDriveItemNode>
> {
  protected abstract get rootDirNode(): TDriveItemNode;

  public async GetItem(
    path: string,
    refreshDepth: number | null = null
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(path);
    let retNode = await this.getNode(pathSegs, null, refreshDepth);

    return retNode?.item ?? null;
  }

  public async GetFolder(
    path: string,
    refreshDepth: number | null = null
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(path);
    let retNode = await this.getNode(pathSegs, true, refreshDepth);

    return retNode?.item ?? null;
  }

  public async ItemExists(path: string): Promise<boolean> {
    let retItem = await this.GetItem(path);
    return !!retItem;
  }

  public async FolderExists(path: string): Promise<boolean> {
    let retItem = await this.GetFolder(path);
    return !!retItem;
  }

  public async FileExists(path: string): Promise<boolean> {
    let retItem = await this.GetItem(path);
    const retVal = !!retItem && retItem.isFolder !== true;

    return retVal;
  }

  public async GetDriveFolderWebUrl(idnf: string): Promise<string | null> {
    throw new Error("Method GetDriveFolderWebUrl is not supported");
  }

  public async GetDriveFileWebUrl(idnf: string): Promise<string | null> {
    throw new Error("Method GetDriveFileWebUrl is not supported");
  }

  public async RenameFolder(
    path: string,
    newFolderName: string
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(path);

    const retNode = await this.copyOrMoveFolder(
      pathSegs,
      true,
      null,
      newFolderName
    );

    return retNode;
  }

  public async CopyFolder(
    path: string,
    newPrPath: string,
    newFolderName: string | null = null
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(path);
    const newPrPathSegs = this.getPathSegments(newPrPath);

    const retNode = await this.copyOrMoveFolder(
      pathSegs,
      false,
      newPrPathSegs,
      newFolderName
    );

    return retNode;
  }

  public async MoveFolder(
    path: string,
    newPrPath: string,
    newFolderName: string | null = null
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(path);
    const newPrPathSegs = this.getPathSegments(newPrPath);

    const retNode = await this.copyOrMoveFolder(
      pathSegs,
      true,
      newPrPathSegs,
      newFolderName
    );

    return retNode;
  }
  public async CreateOfficeLikeFile(
    prPath: string,
    newFileName: string,
    officeLikeFileType: OfficeFileType
  ): Promise<DriveItem | null> {
    const retItem = await this.CreateTextFile(prPath, newFileName, "");
    return retItem;
  }

  public async RenameFile(
    path: string,
    newFileName: string
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(path);

    const retItem = await this.copyOrMoveFile(
      pathSegs,
      false,
      null,
      newFileName
    );

    return retItem;
  }

  public async CopyFile(
    path: string,
    newPrPath: string,
    newFileName: string | null = null
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(path);
    const newPrPathSegs = this.getPathSegments(newPrPath);

    const retItem = await this.copyOrMoveFile(
      pathSegs,
      false,
      newPrPathSegs,
      newFileName
    );

    return retItem;
  }

  public async MoveFile(
    path: string,
    newPrPath: string,
    newFileName: string | null = null
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(path);
    const newPrPathSegs = this.getPathSegments(newPrPath);

    const retItem = await this.copyOrMoveFile(
      pathSegs,
      true,
      newPrPathSegs,
      newFileName
    );

    return retItem;
  }

  public abstract CreateFolder(
    prPath: string,
    newFolderName: string
  ): Promise<DriveItem | null>;

  public abstract CreateTextFile(
    prPath: string,
    newFileName: string,
    text: string
  ): Promise<DriveItem | null>;

  public abstract GetFileText(path: string): Promise<string | null>;
  public abstract DeleteFolder(path: string): Promise<DriveItem | null>;
  public abstract DeleteFile(path: string): Promise<DriveItem | null>;

  protected abstract copyOrMoveFolder(
    pathSegs: string[],
    isMove: boolean,
    newPrPathSegs?: string[] | null,
    newFolderName?: string | null
  ): Promise<DriveItem | null>;

  protected abstract copyOrMoveFile(
    pathSegs: string[],
    isMove: boolean,
    newPrPathSegs?: string[] | null,
    newFileName?: string | null
  ): Promise<DriveItem | null>;

  protected abstract fillFolderDescendants(
    folder: TDriveItemNode
  ): Promise<void>;

  protected async getNode(
    pathSegs: string[],
    isFolder: boolean | null = null,
    refreshDepth: number | null = null
  ) {
    let retItem: TDriveItemNode | null = null;

    if (pathSegs.length > 0) {
      const parentFolder = await this.getParentFolder(
        pathSegs,
        null,
        null,
        refreshDepth
      );

      if (parentFolder) {
        const name = pathSegs.slice(-1)[0];

        if (isFolder) {
          retItem = this.getSubFolder(parentFolder, name) ?? null;
        } else if (isFolder === false) {
          retItem = this.getFolderFile(parentFolder, name) ?? null;
        } else {
          retItem =
            this.getSubFolder(parentFolder, name) ??
            this.getFolderFile(parentFolder, name) ??
            null;
        }
      }
    } else if (isFolder) {
      retItem = this.rootDirNode;
    }

    return retItem ?? null;
  }

  protected async getParentFolder(
    pathSegs: string[],
    parent: TDriveItemNode | null = null,
    level: number | null = null,
    refreshDepth: number | null = null
  ): Promise<TDriveItemNode | null> {
    let retParent: TDriveItemNode | null = null;

    level ??= -1;
    refreshDepth ??= -1;

    if (!parent) {
      if (pathSegs.length > 1) {
        parent = this.rootDirNode;
        retParent = await this.getParentFolder(
          pathSegs,
          parent,
          level + 1,
          refreshDepth
        );
      } else {
        retParent = this.rootDirNode;
      }
    } else {
      await this.assureFolderHasDescendants(parent);

      if (pathSegs.length - level > 1) {
        const dirName = pathSegs[level];

        let node = parent.subFolders!.find((folder) => folder.name === dirName);

        if (node) {
          retParent = await this.getParentFolder(
            pathSegs,
            node,
            level + 1,
            refreshDepth
          );
        }
      } else {
        retParent = parent;
      }
    }

    if (retParent) {
      await this.assureFolderHasDescendants(
        retParent,
        level + refreshDepth - pathSegs.length >= 0
      );
    }

    return retParent;
  }

  protected getSubFolder(parentFolder: TDriveItemNode, folderName: string) {
    const folderNode = parentFolder.subFolders!.find(
      (node) => node.name === folderName
    );

    return folderNode;
  }

  protected async assureFolderHasDescendants(
    folder: TDriveItemNode,
    refresh: boolean | null = null
  ) {
    if (refresh || !folder.subFolders || !folder.folderFiles) {
      await this.fillFolderDescendants(folder);
    }
  }

  protected getFolderFile(parentFolder: TDriveItemNode, fileName: string) {
    const fileNode = parentFolder.folderFiles!.find(
      (node) => node.name === fileName
    );

    return fileNode;
  }

  protected sortItems(itemsArr: TDriveItemNode[]) {
    itemsArr.sort((a, b) => a.name.localeCompare(b.name));
  }

  protected throwIfFolderAlreadyContainsItemName(
    folder: TDriveItemNode,
    itemName: string
  ) {
    if (folder.subFolders) {
      this.throwIfContainsItemName(folder.subFolders, itemName);
    }

    if (folder.folderFiles) {
      this.throwIfContainsItemName(folder.folderFiles, itemName);
    }
  }

  protected addItem(itemsArr: TDriveItemNode[], newItem: TDriveItemNode) {
    const name = newItem.name;

    let idx = itemsArr.findIndex((item) => item.name.localeCompare(name) > 0);

    if (idx >= 0) {
      idx++;
      itemsArr.splice(idx, 0, newItem);
    } else {
      itemsArr.push(newItem);
      idx = itemsArr.length;
    }

    return idx;
  }

  protected throwIfContainsItemName(
    itemsArr: TDriveItemNode[],
    itemName: string,
    errMsg: string | null = null
  ) {
    if (this.containsItemName(itemsArr, itemName)) {
      errMsg ??= "An item with the same name already exists at this location";
      throw new Error(errMsg);
    }
  }

  protected containsItemName(itemsArr: TDriveItemNode[], itemName: string) {
    const idx = itemsArr.findIndex((item) => item.name == itemName);
    return idx >= 0;
  }

  protected getPathSegments(path: string) {
    const segments = getRootedPathSegments(path);
    return segments;
  }
}

export const dirPointers = Object.freeze([".", ".."]);

export const getRootedPathSegments = (
  path: string,
  basePathSegs: string[] | null = null,
  homePathSegs: string[] | null = null
) => {
  const segments = path
    .split("/")
    .filter((seg) => trmrk.isNonEmptyStr(seg, true));

  if (path.startsWith(".")) {
    if (basePathSegs) {
      let sIdx = 0;
      let seg = segments[sIdx];

      let bsIdx = basePathSegs.length - 1;
      let $keepLoop = bsIdx >= 0;

      while ($keepLoop) {
        switch (seg) {
          case ".":
            break;
          case "..":
            bsIdx--;
            break;
          default:
            $keepLoop = false;
            break;
        }

        sIdx++;
        seg = segments[sIdx];
      }

      const baseSegsToAdd = basePathSegs.slice(0, bsIdx);
      segments.splice(0, sIdx, ...baseSegsToAdd);
    } else {
      throw new Error(
        "Relative paths are only allowed if base path segments are also provided"
      );
    }
  } else if (homePathSegs && path.startsWith("~/")) {
    const homePathSegsCount = homePathSegs.length;
    let idx = 1;

    while (idx <= homePathSegsCount && segments[idx] === "..") {
      idx++;
    }

    const pointedHomePathSegs = homePathSegs.slice(
      homePathSegsCount - idx,
      homePathSegsCount
    );

    segments.splice(0, idx, ...pointedHomePathSegs);
  }

  for (let seg of segments) {
    if (seg.trim() != seg || seg.endsWith(".")) {
      throw new Error(
        "Rooted path segments are not allowed to end with the dot symbol or start or end with whitespace"
      );
    } else {
      const chars = [...seg];

      if (chars.filter((ch) => /\s/.test(ch) && ch != " ")) {
        throw new Error(
          "Paths are not allowed to contain any other type of whitespace than the space char"
        );
      } else if (seg.indexOf("  ") >= 0) {
        throw new Error(
          "Paths are not allowed to contain 2 or more spaces one after the other"
        );
      }
    }
  }

  return segments;
};
