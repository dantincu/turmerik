import trmrk from "../index";

import { DriveItem, FileType, OfficeFileType } from "../drive-item";

export interface RootedPathResolvedArgs {
  path: string;
  basePathSegs?: string[] | null | undefined;
  homePathSegs?: string[] | null | undefined;
}

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

  private _subFolders?: TDriveItemNode[] | null | undefined;
  private _folderFiles?: TDriveItemNode[] | null | undefined;

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

  public set subFolders(value: TDriveItemNode[] | null | undefined) {
    this._subFolders = value;
  }

  public get folderFiles(): TDriveItemNode[] | null | undefined {
    return this._folderFiles;
  }

  public set folderFiles(value: TDriveItemNode[] | null | undefined) {
    this._folderFiles = value;
  }
}

export interface IDriveExplorerApi {
  GetItem: (
    pathArgs: RootedPathResolvedArgs,
    parentRefreshDepth?: number | null | undefined
  ) => Promise<DriveItem | null>;
  GetFolder: (
    pathArgs: RootedPathResolvedArgs,
    depth?: number | null | undefined,
    parentRefreshDepth?: number | null | undefined
  ) => Promise<DriveItem | null>;
  ItemExists: (pathArgs: RootedPathResolvedArgs) => Promise<boolean>;
  FolderExists: (pathArgs: RootedPathResolvedArgs) => Promise<boolean>;
  FileExists: (pathArgs: RootedPathResolvedArgs) => Promise<boolean>;
  GetFileText: (pathArgs: RootedPathResolvedArgs) => Promise<string | null>;
  GetDriveFolderWebUrl: (path: string) => Promise<string | null>;
  GetDriveFileWebUrl: (path: string) => Promise<string | null>;
  CreateFolder: (
    prPathArgs: RootedPathResolvedArgs,
    newFolderName: string
  ) => Promise<DriveItem | null>;
  RenameFolder: (
    pathArgs: RootedPathResolvedArgs,
    newFolderName: string
  ) => Promise<DriveItem | null>;
  CopyFolder: (
    pathArgs: RootedPathResolvedArgs,
    newPrPathArgs: RootedPathResolvedArgs,
    newFolderName: string | null
  ) => Promise<DriveItem | null>;
  MoveFolder: (
    pathArgs: RootedPathResolvedArgs,
    newPrPathArgs: RootedPathResolvedArgs,
    newFolderName: string | null
  ) => Promise<DriveItem | null>;
  DeleteFolder: (pathArgs: RootedPathResolvedArgs) => Promise<DriveItem | null>;
  CreateTextFile: (
    prPathArgs: RootedPathResolvedArgs,
    newFileName: string,
    text: string
  ) => Promise<DriveItem | null>;
  CreateOfficeLikeFile: (
    prPathArgs: RootedPathResolvedArgs,
    newFileName: string,
    officeLikeFileType: OfficeFileType
  ) => Promise<DriveItem | null>;
  RenameFile: (
    pathArgs: RootedPathResolvedArgs,
    newFileName: string
  ) => Promise<DriveItem | null>;
  CopyFile: (
    pathArgs: RootedPathResolvedArgs,
    newPrPathArgs: RootedPathResolvedArgs,
    newFileName: string | null
  ) => Promise<DriveItem | null>;
  MoveFile: (
    pathArgs: RootedPathResolvedArgs,
    newPrPathArgs: RootedPathResolvedArgs,
    newFileName: string | null
  ) => Promise<DriveItem | null>;
  DeleteFile: (pathArgs: RootedPathResolvedArgs) => Promise<DriveItem | null>;
}

export abstract class DriveExplorerApiBase<
  TDriveItemNode extends IDriveItemNodeCore<TDriveItemNode>
> {
  protected abstract get rootDirNode(): TDriveItemNode;

  public async GetItem(
    pathArgs: RootedPathResolvedArgs,
    parentRefreshDepth?: number | null | undefined
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(pathArgs);
    let retNode = await this.getNode(pathSegs, null, parentRefreshDepth);

    return retNode?.item ?? null;
  }

  public async GetFolder(
    pathArgs: RootedPathResolvedArgs,
    depth?: number | null | undefined,
    parentRefreshDepth?: number | null | undefined
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(pathArgs);
    let retNode = await this.getNode(pathSegs, true, parentRefreshDepth);

    let subFolders = retNode?.subFolders;
    depth ??= -1;

    if (depth > 0 && subFolders) {
      const tempSubFolders = [...subFolders];

      for (let i = 0; i < tempSubFolders.length; i++) {
        let subFolder = tempSubFolders[i];

        subFolder = (await this.getNode(
          [...pathSegs, subFolder.name],
          true,
          depth - 1
        ))!;

        if (!subFolder) {
          throw new Error("One of the sub folders could not be refreshed");
        } else {
          tempSubFolders[i] = subFolder;
        }
      }

      for (let i = 0; i < subFolders.length; i++) {
        subFolders[i] = tempSubFolders[i];
      }
    }

    const folder = retNode?.item ?? null;
    return folder;
  }

  public async ItemExists(pathArgs: RootedPathResolvedArgs): Promise<boolean> {
    let retItem = await this.GetItem(pathArgs);
    return !!retItem;
  }

  public async FolderExists(
    pathArgs: RootedPathResolvedArgs
  ): Promise<boolean> {
    let retItem = await this.GetFolder(pathArgs);
    return !!retItem;
  }

  public async FileExists(pathArgs: RootedPathResolvedArgs): Promise<boolean> {
    let retItem = await this.GetItem(pathArgs);
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
    pathArgs: RootedPathResolvedArgs,
    newFolderName: string
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(pathArgs);

    const retNode = await this.copyOrMoveFolder(
      pathSegs,
      true,
      null,
      newFolderName
    );

    return retNode;
  }

  public async CopyFolder(
    pathArgs: RootedPathResolvedArgs,
    newPrPathArgs: RootedPathResolvedArgs,
    newFolderName: string | null = null
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(pathArgs);
    const newPrPathSegs = this.getPathSegments(newPrPathArgs);

    const retNode = await this.copyOrMoveFolder(
      pathSegs,
      false,
      newPrPathSegs,
      newFolderName
    );

    return retNode;
  }

  public async MoveFolder(
    pathArgs: RootedPathResolvedArgs,
    newPrPathArgs: RootedPathResolvedArgs,
    newFolderName: string | null = null
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(pathArgs);
    const newPrPathSegs = this.getPathSegments(newPrPathArgs);

    const retNode = await this.copyOrMoveFolder(
      pathSegs,
      true,
      newPrPathSegs,
      newFolderName
    );

    return retNode;
  }
  public async CreateOfficeLikeFile(
    prPathArgs: RootedPathResolvedArgs,
    newFileName: string,
    officeLikeFileType: OfficeFileType
  ): Promise<DriveItem | null> {
    const retItem = await this.CreateTextFile(prPathArgs, newFileName, "");
    return retItem;
  }

  public async RenameFile(
    pathArgs: RootedPathResolvedArgs,
    newFileName: string
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(pathArgs);

    const retItem = await this.copyOrMoveFile(
      pathSegs,
      false,
      null,
      newFileName
    );

    return retItem;
  }

  public async CopyFile(
    pathArgs: RootedPathResolvedArgs,
    newPrPathArgs: RootedPathResolvedArgs,
    newFileName: string | null = null
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(pathArgs);
    const newPrPathSegs = this.getPathSegments(newPrPathArgs);

    const retItem = await this.copyOrMoveFile(
      pathSegs,
      false,
      newPrPathSegs,
      newFileName
    );

    return retItem;
  }

  public async MoveFile(
    pathArgs: RootedPathResolvedArgs,
    newPrPathArgs: RootedPathResolvedArgs,
    newFileName: string | null = null
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(pathArgs);
    const newPrPathSegs = this.getPathSegments(newPrPathArgs);

    const retItem = await this.copyOrMoveFile(
      pathSegs,
      true,
      newPrPathSegs,
      newFileName
    );

    return retItem;
  }

  public abstract CreateFolder(
    prPathArgs: RootedPathResolvedArgs,
    newFolderName: string
  ): Promise<DriveItem | null>;

  public abstract CreateTextFile(
    prPathArgs: RootedPathResolvedArgs,
    newFileName: string,
    text: string
  ): Promise<DriveItem | null>;

  public abstract GetFileText(
    pathArgs: RootedPathResolvedArgs
  ): Promise<string | null>;
  public abstract DeleteFolder(
    pathArgs: RootedPathResolvedArgs
  ): Promise<DriveItem | null>;
  public abstract DeleteFile(
    pathArgs: RootedPathResolvedArgs
  ): Promise<DriveItem | null>;

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
    parentRefreshDepth: number | null = null
  ) {
    let retItem: TDriveItemNode | null = null;

    if (pathSegs.length > 0) {
      const parentFolder = await this.getParentFolder(
        pathSegs,
        null,
        null,
        parentRefreshDepth
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
      await this.assureFolderHasDescendants(retItem);
    }

    return retItem ?? null;
  }

  protected async getParentFolder(
    pathSegs: string[],
    parent: TDriveItemNode | null = null,
    level: number | null = null,
    parentRefreshDepth: number | null = null
  ): Promise<TDriveItemNode | null> {
    let retParent: TDriveItemNode | null = null;

    level ??= -1;
    parentRefreshDepth ??= -1;

    if (!parent) {
      if (pathSegs.length > 1) {
        parent = this.rootDirNode;
        retParent = await this.getParentFolder(
          pathSegs,
          parent,
          level + 1,
          parentRefreshDepth
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
            parentRefreshDepth
          );
        }
      } else {
        retParent = parent;
      }
    }

    if (retParent) {
      await this.assureFolderHasDescendants(
        retParent,
        level + parentRefreshDepth - pathSegs.length >= 0
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

      folder.item.subFolders = folder.subFolders!.map((node) => node.item);
      folder.item.folderFiles = folder.folderFiles!.map((node) => node.item);
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

  protected getPathSegments(args: RootedPathResolvedArgs) {
    const segments = getRootedPathSegments(args);
    return segments;
  }
}

export const dirPointers = Object.freeze([".", ".."]);

export const getRootedPathSegments = (args: RootedPathResolvedArgs) => {
  const segments = args.path
    .split("/")
    .filter((seg) => trmrk.isNonEmptyStr(seg, true));

  if (args.path.startsWith(".")) {
    if (args.basePathSegs) {
      let sIdx = 0;
      let seg = segments[sIdx];

      let bsIdx = args.basePathSegs.length - 1;
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

      const baseSegsToAdd = args.basePathSegs.slice(0, bsIdx);
      segments.splice(0, sIdx, ...baseSegsToAdd);
    } else {
      throw new Error(
        "Relative paths are only allowed if base path segments are also provided"
      );
    }
  } else if (args.homePathSegs && args.path.startsWith("~/")) {
    const homePathSegsCount = args.homePathSegs.length;
    let idx = 1;

    while (idx <= homePathSegsCount && segments[idx] === "..") {
      idx++;
    }

    const pointedHomePathSegs = args.homePathSegs.slice(
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
