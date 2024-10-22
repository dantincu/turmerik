import trmrk from "../../trmrk/index";

import { TrmrkError } from "../../trmrk/TrmrkError";

import {
  IDriveExplorerApi,
  DriveItemNodeCore,
  IDriveItemNodeCore,
  RootedPathResolvedArgs,
  getRootedPathSegments,
  dirPointers,
} from "../../trmrk/DriveExplorerApi/core";

import { DriveItem } from "../../trmrk/drive-item";

import {
  FileType,
  OfficeFileType,
} from "../../trmrk/DotNetTypes/Turmerik.Core.DriveExplorer.DriveItemCore";

import {
  ApiConfigData,
  ApiResponse,
  ApiService,
  ApiServiceType,
  AxiosResponse,
  AxiosConfig,
} from "../core";

export interface FsExplorerApiOpts {
  relPath?: string | null | undefined;
  isLocalFileNotes?: boolean | null | undefined;
  isLocalFilesWinOS?: boolean | null | undefined;
}

interface IDriveItemNode extends IDriveItemNodeCore<IDriveItemNode> {}

class DriveItemNode
  extends DriveItemNodeCore<IDriveItemNode>
  implements IDriveItemNode
{
  constructor(item: DriveItem) {
    super(item);
  }
}

export class FsExplorerApi implements IDriveExplorerApi {
  private readonly relPath: string;
  private readonly hasRelPath: boolean;
  private readonly isLocalFileNotes: boolean;
  private readonly isLocalFilesWinOS: boolean;
  private readonly dirSep: string;
  private _rootDirNode: IDriveItemNode | null = null;

  constructor(private readonly svc: ApiServiceType, opts: FsExplorerApiOpts) {
    this.relPath = opts.relPath ?? "";
    this.hasRelPath = this.relPath !== "";
    this.isLocalFileNotes = opts.isLocalFileNotes ?? false;
    this.isLocalFilesWinOS = opts.isLocalFilesWinOS ?? false;
    this.dirSep = this.isLocalFilesWinOS ? "\\" : "/";
  }

  protected get rootDirNode(): IDriveItemNode {
    if (this._rootDirNode) {
      return this._rootDirNode;
    } else {
      throw new Error(
        "Axios FsExplorerApi must be initialized before propper usage"
      );
    }
  }

  public async Init(forceRefresh?: boolean | null | undefined) {
    if (forceRefresh || !this._rootDirNode) {
      const resp = await this.svc.get<DriveItem>(
        this.getRelUrl("root-folder-entries")
      );

      this.handleApiResp(resp, (data) => {
        this._rootDirNode = {
          item: data,
          isFolder: true,
          name: data.Name,
          folderFiles: data.FolderFiles!.map((item) => new DriveItemNode(item)),
          subFolders: data.SubFolders!.map((item) => new DriveItemNode(item)),
        };
      });
    }
  }

  public async GetItem(
    pathArgs: RootedPathResolvedArgs,
    parentRefreshDepth?: number | null | undefined
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(pathArgs);
    let retNode = await this.getFolderNode(pathSegs, parentRefreshDepth);
    return retNode?.item ?? null;
  }

  public async GetFolder(
    pathArgs: RootedPathResolvedArgs,
    depth?: number | null | undefined,
    parentRefreshDepth?: number | null | undefined
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(pathArgs);
    let retNode = await this.getFolderNode(pathSegs, parentRefreshDepth);

    let subFolders = retNode?.subFolders;
    depth ??= -1;

    if (depth > 0 && subFolders) {
      const tempSubFolders = [...subFolders];

      for (let i = 0; i < tempSubFolders.length; i++) {
        let subFolder = tempSubFolders[i];

        subFolder = (await this.getFolderNode(
          [...pathSegs, subFolder.name],
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
    const retVal = !!retItem && retItem.IsFolder === true;

    return retVal;
  }

  public async FileExists(pathArgs: RootedPathResolvedArgs): Promise<boolean> {
    let retItem = await this.GetItem(pathArgs);
    const retVal = !!retItem && retItem.IsFolder !== true;

    return retVal;
  }

  public async GetFileText(
    pathArgs: RootedPathResolvedArgs
  ): Promise<string | null> {
    const pathSegs = this.getPathSegments(pathArgs);
    let file = await this.getFolderNode(pathSegs);
    let text: string | null = null;

    if (file) {
      const resp = await this.svc.get<string>(
        this.getRelUrl("file-text-contents"),
        {
          Idnf: file.item.Idnf,
        } as DriveItem
      );

      this.handleApiResp(resp, (data) => {
        text = data;
      });
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
    prPathArgs: RootedPathResolvedArgs,
    newFolderName: string
  ): Promise<DriveItem | null> {
    const prPathSegs = this.getPathSegments(prPathArgs);
    let prFolder = await this.getFolderNode(prPathSegs);
    let retNode: IDriveItemNode | null = null;

    if (prFolder) {
      this.throwIfFolderAlreadyContainsItemName(prFolder, newFolderName);

      const resp = await this.svc.post<DriveItem>(
        this.getRelUrl("create-folder"),
        {
          PrIdnf: prFolder.item.Idnf,
          Name: newFolderName,
        } as DriveItem
      );

      this.handleApiResp(resp, (data) => {
        retNode = {
          item: data,
          isFolder: true,
          name: data.Name,
          folderFiles: data.FolderFiles!.map((item) => new DriveItemNode(item)),
          subFolders: data.SubFolders!.map((item) => new DriveItemNode(item)),
        };
      });

      this.addItem(prFolder.subFolders!, retNode!);
    }

    return (retNode as IDriveItemNode | null)?.item ?? null;
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
    newFolderName: string | null
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
    newFolderName: string | null
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

  public async DeleteFolder(
    pathArgs: RootedPathResolvedArgs
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(pathArgs);
    const parentFolder = await this.getFolderNode(pathSegs);
    let retNode: IDriveItemNode | null = null;

    if (parentFolder) {
      retNode = this.getSubFolder(parentFolder, pathSegs.slice(-1)[0]) ?? null;

      if (retNode) {
        const resp = await this.svc.delete<DriveItem>(
          this.getRelUrl("delete-folder"),
          () =>
            ({
              data: { Idnf: retNode!.item.Idnf },
            } as AxiosConfig<DriveItem>)
        );

        this.handleApiResp(resp, () => {
          trmrk.removeAll(
            parentFolder.subFolders!,
            (item) => item.name === retNode?.item.Name
          );
        });
      }
    }

    return retNode?.item ?? null;
  }

  public async CreateTextFile(
    prPathArgs: RootedPathResolvedArgs,
    newFileName: string,
    text: string
  ): Promise<DriveItem | null> {
    const prPathSegs = this.getPathSegments(prPathArgs);
    const parentFolder = await this.getFolderNode(prPathSegs);
    let retNode: IDriveItemNode | null = null;

    if (parentFolder) {
      const resp = await this.svc.post<DriveItem>(
        this.getRelUrl("create-text-file"),
        {
          PrIdnf: parentFolder.item.Idnf,
          Name: newFileName,
          TextFileContents: text,
        } as DriveItem
      );

      this.handleApiResp(resp, (data) => {
        retNode = {
          item: { ...data, TextFileContents: text },
          isFolder: false,
          name: data.Name,
        };

        this.addItem(parentFolder.subFolders!, retNode!);
      });
    }

    return (retNode as IDriveItemNode | null)?.item ?? null;
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
    newFileName: string | null
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
    newFileName: string | null
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

  public async DeleteFile(
    pathArgs: RootedPathResolvedArgs
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(pathArgs);
    const parentFolder = await this.getFolderNode(pathSegs);
    let retNode: IDriveItemNode | null = null;

    if (parentFolder) {
      retNode = this.getFolderFile(parentFolder, pathSegs.slice(-1)[0]) ?? null;

      if (retNode) {
        const resp = await this.svc.delete(
          this.getRelUrl("delete-file"),
          () =>
            ({
              data: { Idnf: retNode!.item.Idnf } as DriveItem,
            } as AxiosConfig<DriveItem>)
        );

        this.handleApiResp(resp, () => {
          trmrk.removeAll(
            parentFolder.folderFiles!,
            (item) => item.name === retNode?.item.Name
          );
        });
      }
    }

    return retNode?.item ?? null;
  }

  protected async copyOrMoveFolder(
    pathSegs: string[],
    isMove: boolean,
    newPrPathSegs?: string[] | null | undefined,
    newFolderName?: string | null | undefined
  ): Promise<DriveItem | null> {
    const parentFolder = await this.getFolderNode(pathSegs);
    let retNode: IDriveItemNode | null = null;
    let newParentFolder: IDriveItemNode | null = null;
    const folderName = pathSegs.slice(-1)[0];

    if (parentFolder) {
      newFolderName ??= folderName;
      const folder = this.getSubFolder(parentFolder, folderName);

      if (newPrPathSegs) {
        newParentFolder = await this.getFolderNode(newPrPathSegs);
      } else {
        newParentFolder = parentFolder;
      }

      if (newParentFolder && folder) {
        this.throwIfFolderAlreadyContainsItemName(
          newParentFolder,
          newFolderName
        );

        let resp: ApiResponse<DriveItem> | null = null;

        if (newPrPathSegs) {
          if (isMove) {
            if (newPrPathSegs) {
              resp = await this.svc.patch<DriveItem>(
                this.getRelUrl("move-folder"),
                {
                  Idnf: folder.item.Idnf,
                  PrIdnf: newParentFolder.item.Idnf,
                  Name: newFolderName,
                } as DriveItem
              );
            } else {
              resp = await this.svc.patch<DriveItem>(
                this.getRelUrl("rename-folder"),
                {
                  Idnf: folder.item.Idnf,
                  Name: newFolderName,
                } as DriveItem
              );
            }
          } else {
            resp = await this.svc.patch<DriveItem>(
              this.getRelUrl("copy-folder"),
              {
                Idnf: folder.item.Idnf,
                PrIdnf: newParentFolder.item.Idnf,
                Name: newFolderName,
              } as DriveItem
            );
          }
        }

        this.handleApiResp(resp, (data) => {
          retNode = {
            item: data,
            isFolder: true,
            name: data.Name,
            folderFiles: data.FolderFiles!.map(
              (item) => new DriveItemNode(item)
            ),
            subFolders: data.SubFolders!.map((item) => new DriveItemNode(item)),
          };

          if (isMove) {
            trmrk.removeAll(
              parentFolder.subFolders!,
              (item) => item.name === retNode?.item.Name
            );
          }

          this.addItem(newParentFolder!.subFolders!, retNode!);
        });
      }
    }

    return (retNode as IDriveItemNode | null)?.item ?? null;
  }

  protected async copyOrMoveFile(
    pathSegs: string[],
    isMove: boolean,
    newPrPathSegs?: string[] | null | undefined,
    newFileName?: string | null | undefined
  ): Promise<DriveItem | null> {
    const parentFolder = await this.getFolderNode(pathSegs);
    let retNode: IDriveItemNode | null = null;
    let newParentFolder: IDriveItemNode | null = null;
    const fileName = pathSegs.slice(-1)[0];

    if (parentFolder) {
      newFileName ??= fileName;
      const file = this.getFolderFile(parentFolder, fileName);

      if (newPrPathSegs) {
        newParentFolder = await this.getFolderNode(newPrPathSegs);
      } else {
        newParentFolder = parentFolder;
      }

      if (newParentFolder && file) {
        this.throwIfFolderAlreadyContainsItemName(newParentFolder, newFileName);

        let resp: ApiResponse<DriveItem> | null = null;

        if (newPrPathSegs) {
          if (isMove) {
            if (newPrPathSegs) {
              resp = await this.svc.patch<DriveItem>(
                this.getRelUrl("move-file"),
                {
                  Idnf: file.item.Idnf,
                  PrIdnf: newParentFolder.item.Idnf,
                  Name: newFileName,
                } as DriveItem
              );
            } else {
              resp = await this.svc.patch<DriveItem>(
                this.getRelUrl("rename-file"),
                {
                  Idnf: file.item.Idnf,
                  Name: newFileName,
                } as DriveItem
              );
            }
          } else {
            resp = await this.svc.patch<DriveItem>(
              this.getRelUrl("copy-file"),
              {
                Idnf: file.item.Idnf,
                PrIdnf: newParentFolder.item.Idnf,
                Name: newFileName,
              } as DriveItem
            );
          }
        }

        this.handleApiResp(resp, (data) => {
          retNode = {
            item: data,
            isFolder: false,
            name: data.Name,
          };

          if (isMove) {
            trmrk.removeAll(
              parentFolder.folderFiles!,
              (item) => item.name === retNode?.item.Name
            );
          }

          this.addItem(newParentFolder!.subFolders!, retNode!);
        });
      }
    }

    return (retNode as IDriveItemNode | null)?.item ?? null;
  }

  protected async getFolderNode(
    pathSegs: string[],
    parentRefreshDepth: number | null = null
  ): Promise<IDriveItemNode | null> {
    parentRefreshDepth ??= -1;
    await this.Init(parentRefreshDepth >= pathSegs.length);
    let retFolder: IDriveItemNode | null = null;

    if (pathSegs.length === 0) {
      retFolder = this.rootDirNode;
    } else {
      const folderName = pathSegs.pop()!;

      const parentFolder = await this.getFolderNode(
        pathSegs,
        parentRefreshDepth - 1
      );

      if (parentFolder) {
        retFolder = this.getSubFolder(parentFolder, folderName) ?? null;

        if (retFolder) {
          await this.assureFolderHasDescendants(
            pathSegs.join(this.dirSep),
            retFolder,
            parentRefreshDepth >= 0
          );
        }
      }
    }

    return retFolder;
  }

  protected async fillFolderDescendants(
    prFolderId: string,
    folder: IDriveItemNode
  ): Promise<void> {
    const resp = await this.svc.get<DriveItem>(
      this.getRelUrl("folder-entries"),
      {
        idnf: [prFolderId, folder.item.Name]
          .filter((s) => (s?.length ?? -1) > 0)
          .join(this.dirSep),
      }
    );

    await this.handleApiRespAsync(resp, async (data) => {
      folder.subFolders = await trmrk.mapAsync(
        data.SubFolders!,
        async (folderNode) => new DriveItemNode(folderNode)
      );

      folder.folderFiles = await trmrk.mapAsync(
        data.FolderFiles!,
        async (fileNode) => new DriveItemNode(fileNode)
      );

      this.sortItems(folder.subFolders);
      this.sortItems(folder.folderFiles);
    });
  }

  protected async assureFolderHasDescendants(
    prFolderId: string,
    folder: IDriveItemNode,
    refresh: boolean | null = null
  ) {
    if (refresh || !folder.subFolders || !folder.folderFiles) {
      await this.fillFolderDescendants(prFolderId, folder);

      folder.item.SubFolders = folder.subFolders!.map((node) => node.item);
      folder.item.FolderFiles = folder.folderFiles!.map((node) => node.item);
    }
  }

  protected getSubFolder(parentFolder: IDriveItemNode, folderName: string) {
    const folderNode = parentFolder.subFolders!.find(
      (node) => node.name === folderName
    );

    return folderNode;
  }

  protected getFolderFile(parentFolder: IDriveItemNode, fileName: string) {
    const fileNode = parentFolder.folderFiles!.find(
      (node) => node.name === fileName
    );

    return fileNode;
  }

  protected sortItems(itemsArr: IDriveItemNode[]) {
    itemsArr.sort((a, b) => a.name.localeCompare(b.name));
  }

  protected throwIfFolderAlreadyContainsItemName(
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

  protected addItem(itemsArr: IDriveItemNode[], newItem: IDriveItemNode) {
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
    itemsArr: IDriveItemNode[],
    itemName: string,
    errMsg: string | null = null
  ) {
    if (this.containsItemName(itemsArr, itemName)) {
      errMsg ??= "An item with the same name already exists at this location";
      throw new Error(errMsg);
    }
  }

  protected containsItemName(itemsArr: IDriveItemNode[], itemName: string) {
    const idx = itemsArr.findIndex((item) => item.name == itemName);
    return idx >= 0;
  }

  protected getPathSegments(args: RootedPathResolvedArgs) {
    const segments = getRootedPathSegments(args);
    return segments;
  }

  private handleApiResp<T>(
    resp: ApiResponse<T> | null,
    onSuccess: (data: T) => void,
    onError?: (resp: ApiResponse<T> | null) => void
  ) {
    if (resp && resp.isSuccess && resp.data) {
      onSuccess(resp.data);
    } else {
      onError ??= this.handleApiError;
      onError(resp);
    }
  }

  private async handleApiRespAsync<T>(
    resp: ApiResponse<T> | null,
    onSuccess: (data: T) => Promise<void>,
    onError?: (resp: ApiResponse<T> | null) => Promise<void>
  ) {
    if (resp && resp.isSuccess && resp.data) {
      await onSuccess(resp.data);
    } else {
      onError ??= this.handleApiErrorAsync;
      await onError(resp);
    }
  }

  private handleApiError<T>(resp: ApiResponse<T> | null) {
    const err =
      resp?.error ??
      new TrmrkError(
        resp?.errMessage ?? "An error has occurred",
        null,
        resp
          ? {
              statusCode: resp.status,
              statusText: resp.statusText,
              data: resp,
            }
          : null
      );

    throw err;
  }

  private async handleApiErrorAsync<T>(resp: ApiResponse<T> | null) {
    const err =
      resp?.error ??
      new TrmrkError(
        resp?.errMessage ?? "An error has occurred",
        null,
        resp
          ? {
              statusCode: resp.status,
              statusText: resp.statusText,
              data: resp,
            }
          : null
      );

    throw err;
  }

  private getRelUrl(relUrl: string) {
    if (this.hasRelPath) {
      relUrl = [this.relPath, relUrl].join("/");
    }

    return relUrl;
  }
}
