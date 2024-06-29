import trmrk from "../../trmrk";

import { DriveItem, FileType, OfficeFileType } from "../../trmrk/drive-item";

import {
  RootedPathResolvedArgs,
  IDriveItemNodeCore,
  DriveItemNodeCore,
  DriveExplorerApiBase,
  IDriveExplorerApi,
} from "../../trmrk/DriveExplorerApi/core";

import {
  ApiConfigData,
  ApiResponse,
  ApiService,
  ApiServiceType,
  AxiosResponse,
} from "../core";

export interface DriveExplorerApiOpts {
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

export class DriveExplorerApi
  extends DriveExplorerApiBase<IDriveItemNode>
  implements IDriveExplorerApi
{
  private readonly relPath: string;
  private readonly hasRelPath: boolean;
  private readonly isLocalFileNotes: boolean;
  private readonly isLocalFilesWinOS: boolean;
  private readonly dirSep: string;
  private _rootDirNode: IDriveItemNode | null = null;

  constructor(
    private readonly svc: ApiServiceType,
    opts: DriveExplorerApiOpts
  ) {
    super();
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
        "Axios DriveExplorerApi must be initialized before propper usage"
      );
    }
  }

  public override async Init(forceRefresh?: boolean | null | undefined) {
    if (forceRefresh || !this._rootDirNode) {
      const resp = await this.svc.get<DriveItem>(
        this.getRelUrl("folder-entries")
      );

      this.handleApiResp(resp, (data) => {
        this._rootDirNode = {
          item: data,
          isFolder: true,
          name: data.name,
          folderFiles: data.folderFiles.map((item) => new DriveItemNode(item)),
          subFolders: data.subFolders.map((item) => new DriveItemNode(item)),
        };
      });
    }
  }

  public override async GetFileText(
    pathArgs: RootedPathResolvedArgs
  ): Promise<string | null> {
    const pathSegs = this.getPathSegments(pathArgs);
    let file = await this.getNode(pathSegs, false);
    let text: string | null = null;

    if (file) {
      const resp = await this.svc.get<string>(
        this.getRelUrl("file-text-contents"),
        {
          idnf: file.item.idnf,
        } as DriveItem
      );

      this.handleApiResp(resp, (data) => {
        text = data;
      });
    }

    return text;
  }

  public override async CreateFolder(
    prPathArgs: RootedPathResolvedArgs,
    newFolderName: string
  ): Promise<DriveItem | null> {
    const prPathSegs = this.getPathSegments(prPathArgs);
    let prFolder = await this.getNode(prPathSegs, true);
    let retNode: IDriveItemNode | null = null;

    if (prFolder) {
      this.throwIfFolderAlreadyContainsItemName(prFolder, newFolderName);

      const resp = await this.svc.post<DriveItem>(
        this.getRelUrl("create-folder"),
        {
          prIdnf: prFolder.item.idnf,
          name: newFolderName,
        } as DriveItem
      );

      this.handleApiResp(resp, (data) => {
        retNode = {
          item: data,
          isFolder: true,
          name: data.name,
          folderFiles: data.folderFiles.map((item) => new DriveItemNode(item)),
          subFolders: data.subFolders.map((item) => new DriveItemNode(item)),
        };
      });

      this.addItem(prFolder.subFolders!, retNode!);
    }

    return (retNode as IDriveItemNode | null)?.item ?? null;
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
        const resp = await this.svc.delete(
          this.getRelUrl("delete-folder"),
          () => ({
            data: { idnf: retNode!.item.idnf } as DriveItem,
          })
        );

        this.handleApiResp(resp, () => {
          trmrk.removeAll(
            parentFolder.subFolders!,
            (item) => item.name === retNode?.item.name
          );
        });
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
      const resp = await this.svc.post<DriveItem>(
        this.getRelUrl("create-text-file"),
        {
          prIdnf: parentFolder.item.idnf,
          name: newFileName,
          textFileContents: text,
        } as DriveItem
      );

      this.handleApiResp(resp, (data) => {
        retNode = {
          item: { ...data, textFileContents: text },
          isFolder: false,
          name: data.name,
        };

        this.addItem(parentFolder.subFolders!, retNode!);
      });
    }

    return (retNode as IDriveItemNode | null)?.item ?? null;
  }

  public override async DeleteFile(
    pathArgs: RootedPathResolvedArgs
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(pathArgs);
    const parentFolder = await this.getParentFolder(pathSegs);
    let retNode: IDriveItemNode | null = null;

    if (parentFolder) {
      retNode = this.getFolderFile(parentFolder, pathSegs.slice(-1)[0]) ?? null;

      if (retNode) {
        const resp = await this.svc.delete(
          this.getRelUrl("delete-file"),
          () => ({
            data: { idnf: retNode!.item.idnf } as DriveItem,
          })
        );

        this.handleApiResp(resp, () => {
          trmrk.removeAll(
            parentFolder.folderFiles!,
            (item) => item.name === retNode?.item.name
          );
        });
      }
    }

    return retNode?.item ?? null;
  }

  protected override async copyOrMoveFolder(
    pathSegs: string[],
    isMove: boolean,
    newPrPathSegs?: string[] | null | undefined,
    newFolderName?: string | null | undefined
  ): Promise<DriveItem | null> {
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

        let resp: ApiResponse<DriveItem> | null = null;

        if (newPrPathSegs) {
          if (isMove) {
            if (newPrPathSegs) {
              resp = await this.svc.patch<DriveItem>(
                this.getRelUrl("move-folder"),
                {
                  idnf: folder.item.idnf,
                  prIdnf: newParentFolder.item.idnf,
                  name: newFolderName,
                } as DriveItem
              );
            } else {
              resp = await this.svc.patch<DriveItem>(
                this.getRelUrl("rename-folder"),
                {
                  idnf: folder.item.idnf,
                  name: newFolderName,
                } as DriveItem
              );
            }
          } else {
            resp = await this.svc.patch<DriveItem>(
              this.getRelUrl("copy-folder"),
              {
                idnf: folder.item.idnf,
                prIdnf: newParentFolder.item.idnf,
                name: newFolderName,
              } as DriveItem
            );
          }
        }

        this.handleApiResp(resp, (data) => {
          retNode = {
            item: data,
            isFolder: true,
            name: data.name,
            folderFiles: data.folderFiles.map(
              (item) => new DriveItemNode(item)
            ),
            subFolders: data.subFolders.map((item) => new DriveItemNode(item)),
          };

          if (isMove) {
            trmrk.removeAll(
              parentFolder.subFolders!,
              (item) => item.name === retNode?.item.name
            );
          }

          this.addItem(newParentFolder!.subFolders!, retNode!);
        });
      }
    }

    return (retNode as IDriveItemNode | null)?.item ?? null;
  }

  protected override async copyOrMoveFile(
    pathSegs: string[],
    isMove: boolean,
    newPrPathSegs?: string[] | null | undefined,
    newFileName?: string | null | undefined
  ): Promise<DriveItem | null> {
    const parentFolder = await this.getParentFolder(pathSegs);
    let retNode: IDriveItemNode | null = null;
    let newParentFolder: IDriveItemNode | null = null;
    const fileName = pathSegs.slice(-1)[0];

    if (parentFolder) {
      newFileName ??= fileName;
      const file = this.getFolderFile(parentFolder, fileName);

      if (newPrPathSegs) {
        newParentFolder = await this.getNode(newPrPathSegs);
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
                  idnf: file.item.idnf,
                  prIdnf: newParentFolder.item.idnf,
                  name: newFileName,
                } as DriveItem
              );
            } else {
              resp = await this.svc.patch<DriveItem>(
                this.getRelUrl("rename-file"),
                {
                  idnf: file.item.idnf,
                  name: newFileName,
                } as DriveItem
              );
            }
          } else {
            resp = await this.svc.patch<DriveItem>(
              this.getRelUrl("copy-file"),
              {
                idnf: file.item.idnf,
                prIdnf: newParentFolder.item.idnf,
                name: newFileName,
              } as DriveItem
            );
          }
        }

        this.handleApiResp(resp, (data) => {
          retNode = {
            item: data,
            isFolder: false,
            name: data.name,
          };

          if (isMove) {
            trmrk.removeAll(
              parentFolder.folderFiles!,
              (item) => item.name === retNode?.item.name
            );
          }

          this.addItem(newParentFolder!.subFolders!, retNode!);
        });
      }
    }

    return (retNode as IDriveItemNode | null)?.item ?? null;
  }

  protected override async fillFolderDescendants(
    folder: IDriveItemNode
  ): Promise<void> {
    const resp = await this.svc.get<DriveItem>(
      this.getRelUrl("folder-entries"),
      {
        idnf: folder.item.idnf,
      }
    );

    await this.handleApiRespAsync(resp, async (data) => {
      folder.subFolders = await trmrk.mapAsync(
        data.subFolders,
        async (folderNode) => new DriveItemNode(folderNode)
      );

      folder.folderFiles = await trmrk.mapAsync(
        data.folderFiles,
        async (fileNode) => new DriveItemNode(fileNode)
      );

      this.sortItems(folder.subFolders);
      this.sortItems(folder.folderFiles);
    });
  }

  private async handleApiResp<T>(
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
      resp?.error ?? new Error(resp?.errMessage ?? "An error has occurred");

    throw err;
  }

  private async handleApiErrorAsync<T>(resp: ApiResponse<T> | null) {
    const err =
      resp?.error ?? new Error(resp?.errMessage ?? "An error has occurred");

    throw err;
  }

  private getRelUrl(relUrl: string) {
    if (this.hasRelPath) {
      relUrl = [this.relPath, relUrl].join(this.dirSep);
    }

    return relUrl;
  }
}
