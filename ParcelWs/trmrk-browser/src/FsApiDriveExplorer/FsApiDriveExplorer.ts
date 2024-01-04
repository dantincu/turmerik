import { core as trmrk } from "trmrk";

import { DriveItem, FileType, OfficeFileType } from "trmrk/src/drive-item";

import { getDescendantHandles } from "trmrk-browser-core/src/fsApi/core";
import { IDriveExplorerApi, getPathSegments } from "../DriveExplorerApi/core";

interface IDriveItemNode {
  item: DriveItem;
  name: string;
  handle: FileSystemHandle;
  dirHandle?: FileSystemDirectoryHandle | null | undefined;
  fileHandle?: FileSystemFileHandle | null | undefined;

  subFolders?: IDriveItemNode[] | null | undefined;
  folderFiles?: IDriveItemNode[] | null | undefined;
}

class DriveItemNode implements IDriveItemNode {
  private readonly _item: DriveItem;
  private readonly _name: string;
  private readonly _isFolder: boolean;
  private readonly _handle: FileSystemHandle;
  private readonly _dirHandle?: FileSystemDirectoryHandle | null | undefined;
  private readonly _fileHandle?: FileSystemFileHandle | null | undefined;

  private readonly _subFolders?: IDriveItemNode[] | null | undefined;
  private readonly _folderFiles?: IDriveItemNode[] | null | undefined;

  constructor(handle: FileSystemHandle, item?: DriveItem | null | undefined) {
    this._item =
      item ??
      ({
        name: handle.name,
        isFolder: handle.kind === "directory",
      } as DriveItem);

    this._name = this._item.name;
    this._isFolder = this._item.isFolder ?? false;
    this._handle = handle;

    if (this._item.isFolder) {
      this._dirHandle = this._handle as FileSystemDirectoryHandle;
    } else {
      this._fileHandle = this._handle as FileSystemFileHandle;
    }
  }

  public get item(): DriveItem {
    return this._item;
  }

  public get name(): string {
    return this._name;
  }

  public get isFolder(): boolean | null | undefined {
    return this._isFolder;
  }

  public get handle(): FileSystemHandle {
    return this._handle;
  }

  public get dirHandle(): FileSystemDirectoryHandle | null | undefined {
    return this._dirHandle;
  }

  public get fileHandle(): FileSystemFileHandle | null | undefined {
    return this._fileHandle;
  }

  public get subFolders(): IDriveItemNode[] | null | undefined {
    return this._subFolders;
  }

  public get folderFiles(): IDriveItemNode[] | null | undefined {
    return this._folderFiles;
  }
}

export class FsApiDriveExplorer implements IDriveExplorerApi {
  private readonly _rootDirNode: IDriveItemNode;

  constructor(rootDirHandle: FileSystemDirectoryHandle) {
    this._rootDirNode = new DriveItemNode(rootDirHandle);
    this._rootDirNode.item.isRootFolder = true;
  }

  public async GetItem(
    idnf: string,
    refreshDepth: number | null = null
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(idnf);
    let retNode = await this.getNode(pathSegs, null, refreshDepth);

    return retNode?.item ?? null;
  }

  public async GetFolder(
    idnf: string,
    refreshDepth: number | null = null
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(idnf);
    let retNode = await this.getNode(pathSegs, true, refreshDepth);

    return retNode?.item ?? null;
  }

  public async ItemExists(idnf: string): Promise<boolean> {
    let retItem = await this.GetItem(idnf);
    return !!retItem;
  }

  public async FolderExists(idnf: string): Promise<boolean> {
    let retItem = await this.GetFolder(idnf);
    return !!retItem;
  }

  public async FileExists(idnf: string): Promise<boolean> {
    let retItem = await this.GetItem(idnf);
    const retVal = !!retItem && retItem.isFolder !== true;

    return retVal;
  }

  public async GetFileText(idnf: string): Promise<string | null> {
    const pathSegs = this.getPathSegments(idnf);
    let retNode = await this.getNode(pathSegs, false);
    let text: string | null = null;

    if (retNode) {
      const handle = retNode.fileHandle!;
      const file = await handle.getFile();

      text = await file.text();
    }

    return text;
  }

  public async GetDriveFolderWebUrl(idnf: string): Promise<string | null> {
    throw new Error("Method GetDriveFolderWebUrl is not supported");
  }

  public async GetDriveFileWebUrl(idnf: string): Promise<string | null> {
    throw new Error("Method GetDriveFileWebUrl is not supported");
  }

  public async CreateFolder(
    prIdnf: string,
    newFolderName: string
  ): Promise<DriveItem | null> {
    const prPathSegs = this.getPathSegments(prIdnf);
    const parentFolder = await this.getParentFolder(prPathSegs);
    let retNode: IDriveItemNode | null = null;

    if (parentFolder) {
      this.throwIfFolderAlreadyContainsItemName(parentFolder, newFolderName);
      const handle = parentFolder.dirHandle!;

      const childHandle = await handle.getDirectoryHandle(newFolderName, {
        create: true,
      });

      retNode = await this.createNode(childHandle);
      this.addItem(parentFolder.subFolders!, retNode);
    }

    return retNode?.item ?? null;
  }

  public async RenameFolder(
    idnf: string,
    newFolderName: string
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(idnf);
    const parentFolder = await this.getParentFolder(pathSegs);
    let retNode: IDriveItemNode | null = null;

    if (parentFolder) {
      this.throwIfFolderAlreadyContainsItemName(parentFolder, newFolderName);
      const handle = parentFolder.dirHandle!;
    }
  }

  public async CopyFolder(
    idnf: string,
    newPrIdnf: string,
    newFolderName: string
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(idnf);
    const newPrPathSegs = this.getPathSegments(newPrIdnf);

    const parentFolder = await this.getParentFolder(pathSegs);
    const newParentFolder = await this.getParentFolder(newPrPathSegs);
    let retNode: IDriveItemNode | null = null;
  }

  public async MoveFolder(
    idnf: string,
    newPrIdnf: string,
    newFolderName: string
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(idnf);
    const newPrPathSegs = this.getPathSegments(newPrIdnf);

    const parentFolder = await this.getParentFolder(pathSegs);
    const newParentFolder = await this.getParentFolder(newPrPathSegs);
    let retNode: IDriveItemNode | null = null;
  }

  public async DeleteFolder(idnf: string): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(idnf);
    const parentFolder = await this.getParentFolder(pathSegs);
    let retNode: IDriveItemNode | null = null;
  }

  public async CreateTextFile(
    prIdnf: string,
    newFileName: string,
    text: string
  ): Promise<DriveItem | null> {
    const prPathSegs = this.getPathSegments(prIdnf);
    const parentFolder = await this.getParentFolder(prPathSegs);
    let retNode: IDriveItemNode | null = null;
  }

  public async CreateOfficeLikeFile(
    prIdnf: string,
    newFileName: string,
    officeLikeFileType: OfficeFileType
  ): Promise<DriveItem | null> {
    const prPathSegs = this.getPathSegments(prIdnf);
    const parentFolder = await this.getParentFolder(prPathSegs);
    let retNode: IDriveItemNode | null = null;
  }

  public async RenameFile(
    idnf: string,
    newFileName: string
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(idnf);
    const parentFolder = await this.getParentFolder(pathSegs);
    let retNode: IDriveItemNode | null = null;
  }

  public async CopyFile(
    idnf: string,
    newPrIdnf: string,
    newFileName: string
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(idnf);
    const newPrPathSegs = this.getPathSegments(newPrIdnf);

    const parentFolder = await this.getParentFolder(pathSegs);
    const newParentFolder = await this.getParentFolder(newPrPathSegs);
    let retNode: IDriveItemNode | null = null;
  }

  public async MoveFile(
    idnf: string,
    newPrIdnf: string,
    newFileName: string
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(idnf);
    const newPrPathSegs = this.getPathSegments(newPrIdnf);

    const parentFolder = await this.getParentFolder(pathSegs);
    const newParentFolder = await this.getParentFolder(newPrPathSegs);
    let retNode: IDriveItemNode | null = null;
  }

  public async DeleteFile(idnf: string): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(idnf);
    const parentFolder = await this.getParentFolder(pathSegs);
    let retNode: IDriveItemNode | null = null;
  }

  private async getNode(
    pathSegs: string[],
    isFolder: boolean | null = null,
    refreshDepth: number | null = null
  ) {
    let retItem: IDriveItemNode | null = null;

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
      retItem = this._rootDirNode;
    }

    return retItem ?? null;
  }

  private async createNode(handle: FileSystemHandle) {
    const item = await this.createItem(handle);
    const node = new DriveItemNode(handle, item);

    return node;
  }

  private async createItem(handle: FileSystemHandle) {
    const item = {
      name: handle.name,
      isFolder: handle.kind === "directory",
    } as DriveItem;

    if (!item.isFolder) {
      const fileHandle = handle as FileSystemFileHandle;
      const file = await fileHandle.getFile();

      if (file.lastModified) {
        item.lastWriteTime = new Date(file.lastModified);
      }
    }

    return item;
  }

  private async getParentFolder(
    pathSegs: string[],
    parent: IDriveItemNode | null = null,
    level: number | null = null,
    refreshDepth: number | null = null
  ): Promise<IDriveItemNode | null> {
    let retParent: IDriveItemNode | null = null;

    level ??= -1;
    refreshDepth ??= -1;

    if (!parent) {
      if (pathSegs.length > 1) {
        parent = this._rootDirNode;
        retParent = await this.getParentFolder(
          pathSegs,
          parent,
          level + 1,
          refreshDepth
        );
      } else {
        retParent = this._rootDirNode;
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

  private async assureFolderHasDescendants(
    folder: IDriveItemNode,
    refresh: boolean | null = null
  ) {
    if (refresh || !folder.subFolders || !folder.folderFiles) {
      await this.fillFolderDescendants(folder);
    }
  }

  private async fillFolderDescendants(folder: IDriveItemNode) {
    const dirHandle = folder.dirHandle!;
    const descendants = await getDescendantHandles(dirHandle);

    folder.subFolders = await trmrk.mapAsync(
      descendants.subFolders,
      async (folderNode) => await this.createNode(folderNode.folderHandle)
    );

    folder.folderFiles = await trmrk.mapAsync(
      descendants.folderFiles,
      async (fileHandle) => await this.createNode(fileHandle)
    );

    this.sortItems(folder.subFolders);
    this.sortItems(folder.folderFiles);
  }

  private getSubFolder(parentFolder: IDriveItemNode, folderName: string) {
    const folderNode = parentFolder.subFolders!.find(
      (node) => node.name === folderName
    );

    return folderNode;
  }

  private getFolderFile(parentFolder: IDriveItemNode, fileName: string) {
    const fileNode = parentFolder.folderFiles!.find(
      (node) => node.name === fileName
    );

    return fileNode;
  }

  private getPathSegments(idnf: string) {
    const segments = getPathSegments(idnf);
    return segments;
  }

  private sortItems(itemsArr: IDriveItemNode[]) {
    itemsArr.sort((a, b) => a.name.localeCompare(b.name));
  }

  private throwIfFolderAlreadyContainsItemName(
    folder: IDriveItemNode,
    itemName: string
  ) {
    if (folder.subFolders) {
      this.throwIfContainsItemName(folder.subFolders, itemName);
    }

    if (folder.folderFiles) {
      this.throwIfContainsItemName(folder.folderFiles, itemName);
    }
  }

  private throwIfContainsItemName(
    itemsArr: IDriveItemNode[],
    itemName: string,
    errMsg: string | null = null
  ) {
    if (this.containsItemName(itemsArr, itemName)) {
      errMsg ??= "An item with the same name already exists at this location";
      throw new Error(errMsg);
    }
  }

  private containsItemName(itemsArr: IDriveItemNode[], itemName: string) {
    const idx = itemsArr.findIndex((item) => item.name == itemName);
    return idx >= 0;
  }

  private addItem(itemsArr: IDriveItemNode[], newItem: IDriveItemNode) {
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
}
