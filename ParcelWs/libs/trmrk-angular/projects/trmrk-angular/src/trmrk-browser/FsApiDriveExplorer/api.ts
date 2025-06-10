import trmrk from '../../trmrk';

import { DriveItem } from '../../trmrk/drive-item';
import {
  FileType,
  OfficeFileType,
} from '../../trmrk/DotNetTypes/Turmerik.Core.DriveExplorer.DriveItemCore';

import {
  RootedPathResolvedArgs,
  IDriveItemNodeCore,
  DriveItemNodeCore,
  DriveExplorerApiBase,
  IDriveExplorerApi,
} from '../../trmrk/DriveExplorerApi/core';

import { FsApiEntry, FsApiFolder, SrcTrgPair } from '../fsApi/core';
import { getDescendants } from '../fsApi/hcy';
import { copyFile, moveFile, writeToFile } from '../fsApi/file';
import { copyFolder, deleteFolder, moveFolder } from '../fsApi/folder';

interface IDriveItemNode extends IDriveItemNodeCore<IDriveItemNode> {
  handle: FileSystemHandle;
  dirHandle?: FileSystemDirectoryHandle | null | undefined;
  fileHandle?: FileSystemFileHandle | null | undefined;
}

class DriveItemNode
  extends DriveItemNodeCore<IDriveItemNode>
  implements IDriveItemNode
{
  private readonly _handle: FileSystemHandle;
  private readonly _dirHandle?: FileSystemDirectoryHandle | null | undefined;
  private readonly _fileHandle?: FileSystemFileHandle | null | undefined;

  constructor(handle: FileSystemHandle, item?: DriveItem | null | undefined) {
    super(
      (item ??= {
        Name: handle.name,
        IsFolder: handle.kind === 'directory',
      } as DriveItem)
    );

    this._handle = handle;

    if (this.item.IsFolder) {
      this._dirHandle = this._handle as FileSystemDirectoryHandle;
    } else {
      this._fileHandle = this._handle as FileSystemFileHandle;
    }
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
}

export class DriveExplorerApi
  extends DriveExplorerApiBase<IDriveItemNode>
  implements IDriveExplorerApi
{
  private readonly _rootDirNode: IDriveItemNode;

  constructor(rootDirHandle: FileSystemDirectoryHandle) {
    super();
    this._rootDirNode = new DriveItemNode(rootDirHandle);
    this._rootDirNode.item.IsRootFolder = true;
  }

  protected override get rootDirNode(): IDriveItemNode {
    return this._rootDirNode;
  }

  public override async GetFileText(
    pathArgs: RootedPathResolvedArgs
  ): Promise<string | null> {
    const pathSegs = this.getPathSegments(pathArgs);
    let retNode = await this.getNode(pathSegs, false);
    let text: string | null = null;

    if (retNode) {
      const handle = retNode.fileHandle!;
      const file = await handle.getFile();

      text = await file.text();
    }

    return text;
  }

  public override async CreateFolder(
    prPathArgs: RootedPathResolvedArgs,
    newFolderName: string
  ): Promise<DriveItem | null> {
    const prPathSegs = this.getPathSegments(prPathArgs);
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

  public override async DeleteFolder(
    pathArgs: RootedPathResolvedArgs
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(pathArgs);
    const parentFolder = await this.getParentFolder(pathSegs);
    let retNode: IDriveItemNode | null = null;

    if (parentFolder) {
      retNode = this.getSubFolder(parentFolder, pathSegs.slice(-1)[0]) ?? null;

      if (retNode) {
        await deleteFolder(parentFolder.dirHandle!, retNode.dirHandle!);

        trmrk.removeAll(
          parentFolder.subFolders!,
          (item) => item.name === retNode?.item.Name
        );
      }
    }

    return retNode?.item ?? null;
  }

  public override async CreateTextFile(
    prPathArgs: RootedPathResolvedArgs,
    newFileName: string,
    text: string
  ): Promise<DriveItem | null> {
    const prPathSegs = this.getPathSegments(prPathArgs);
    const parentFolder = await this.getNode(prPathSegs);
    let retNode: IDriveItemNode | null = null;

    if (parentFolder) {
      const file = await parentFolder.dirHandle!.getFileHandle(newFileName, {
        create: true,
      });

      await writeToFile(file, text);

      retNode = await this.toNode({
        name: newFileName,
        isFolder: false,
        handle: file,
      });

      let idx = parentFolder.folderFiles!.findIndex(
        (file) => file.name.localeCompare(newFileName) < 0
      );

      idx = idx >= 0 ? idx : parentFolder.folderFiles!.length;
      parentFolder.folderFiles!.splice(idx, 0, retNode);
    }

    return retNode?.item ?? null;
  }

  public override async DeleteFile(
    pathArgs: RootedPathResolvedArgs
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(pathArgs);
    const parentFolder = await this.getParentFolder(pathSegs);
    let retNode: IDriveItemNode | null = null;
    const fileName = pathSegs.slice(-1)[0];

    if (parentFolder) {
      retNode = this.getFolderFile(parentFolder, pathSegs.slice(-1)[0]) ?? null;

      if (retNode) {
        const parentDirHandle = parentFolder.dirHandle!;
        await parentDirHandle.removeEntry(fileName);

        trmrk.removeAll(
          parentFolder.folderFiles!,
          (item) => item.name === retNode?.item.Name
        );
      }
    }

    return retNode?.item ?? null;
  }

  protected override async fillFolderDescendants(
    prFolderId: string,
    folder: IDriveItemNode
  ) {
    const dirHandle = folder.dirHandle!;
    const descendants = await getDescendants(dirHandle);

    folder.subFolders = await trmrk.mapAsync(
      descendants.subFolders,
      async (folderNode) => await this.createNode(folderNode.handle)
    );

    folder.folderFiles = await trmrk.mapAsync(
      descendants.folderFiles,
      async (fileNode) => await this.createNode(fileNode.handle)
    );

    this.sortItems(folder.subFolders);
    this.sortItems(folder.folderFiles);
  }

  protected override async copyOrMoveFolder(
    pathSegs: string[],
    isMove: boolean,
    newPrPathSegs: string[] | null = null,
    newFolderName: string | null = null
  ) {
    const parentFolder = await this.getParentFolder(pathSegs);
    let retNode: IDriveItemNode | null = null;
    let newParentFolder: IDriveItemNode | null = null;
    const folderName = pathSegs.slice(-1)[0];

    if (parentFolder) {
      newFolderName ??= folderName;
      const folder = this.getSubFolder(parentFolder, folderName);

      if (newPrPathSegs) {
        newParentFolder = await this.getNode(newPrPathSegs);
      } else {
        newParentFolder = parentFolder;
      }

      if (newParentFolder && folder) {
        this.throwIfFolderAlreadyContainsItemName(
          newParentFolder,
          newFolderName
        );

        let hcy: SrcTrgPair<FsApiFolder>;

        if (isMove) {
          hcy = await moveFolder(
            parentFolder.dirHandle!,
            folder.dirHandle!,
            newParentFolder.dirHandle!,
            newFolderName
          );
        } else {
          hcy = await copyFolder(
            folder.dirHandle!,
            newParentFolder.dirHandle!,
            newFolderName
          );
        }

        const trg = hcy.trg;
        retNode = this.toNode(trg);

        retNode.subFolders = trg.subFolders.map((obj) => this.toNode(obj));
        retNode.folderFiles = trg.folderFiles.map((obj) => this.toNode(obj));
      }
    }

    return retNode?.item ?? null;
  }

  protected override async copyOrMoveFile(
    pathSegs: string[],
    isMove: boolean,
    newPrPathSegs: string[] | null = null,
    newFileName: string | null = null
  ) {
    const parentFolder = await this.getParentFolder(pathSegs);
    let retNode: IDriveItemNode | null = null;
    let newParentFolder: IDriveItemNode | null = null;
    const fileName = pathSegs.slice(-1)[0];

    if (parentFolder) {
      newFileName ??= fileName;
      this.throwIfFolderAlreadyContainsItemName(parentFolder, newFileName);
      const fileNode = this.getFolderFile(parentFolder, fileName);

      if (newPrPathSegs) {
        newParentFolder = await this.getNode(newPrPathSegs);
      } else {
        newParentFolder = parentFolder;
      }

      if (newParentFolder && fileNode) {
        const file = await fileNode.fileHandle!.getFile();
        let newFileHandle: FileSystemFileHandle;

        if (isMove) {
          newFileHandle = await moveFile(
            parentFolder.dirHandle!,
            file,
            newParentFolder.dirHandle!,
            newFileName
          );
        } else {
          newFileHandle = await copyFile(
            file,
            newParentFolder.dirHandle!,
            newFileName
          );
        }

        retNode = this.toNode({
          name: newFileName,
          isFolder: false,
          handle: newFileHandle,
        });
      }
    }

    return retNode?.item ?? null;
  }

  private toNode(node: FsApiEntry<FileSystemHandle>) {
    const item = this.toItem(node);
    const retNode = new DriveItemNode(node.handle, item);

    return retNode;
  }

  private toItem(node: FsApiEntry<FileSystemHandle>) {
    const item = {
      Name: node.name,
      IsFolder: node.isFolder,
      LastWriteTime: new Date().toString(),
    } as unknown as DriveItem;

    return item;
  }

  private async createNode(handle: FileSystemHandle) {
    const item = await this.createItem(handle);
    const node = new DriveItemNode(handle, item);

    return node;
  }

  private async createItem(handle: FileSystemHandle) {
    const item = {
      Name: handle.name,
      IsFolder: handle.kind === 'directory',
    } as DriveItem;

    if (!item.IsFolder) {
      const fileHandle = handle as FileSystemFileHandle;
      const file = await fileHandle.getFile();

      if (file.lastModified) {
        item.LastWriteTimeStr = new Date(file.lastModified).toString();
      }
    }

    return item;
  }
}
