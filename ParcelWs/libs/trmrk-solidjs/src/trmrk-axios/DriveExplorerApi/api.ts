import trmrk from "../../trmrk";

import { DriveItem, fillDriveItemTimeStamps } from "../../trmrk/drive-item";
import { TrmrkError } from "../../trmrk/TrmrkError";

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
  AxiosConfig,
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
    fillDriveItemTimeStamps(item);
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
          Idnf: file.item.Idnf,
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

  public override async DeleteFolder(
    pathArgs: RootedPathResolvedArgs
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(pathArgs);
    const parentFolder = await this.getParentFolder(pathSegs);
    let retNode: IDriveItemNode | null = null;

    if (parentFolder) {
      retNode = this.getSubFolder(parentFolder, pathSegs.slice(-1)[0]) ?? null;

      if (retNode) {
        const resp = await this.svc.delete<DriveItem>(
          this.getRelUrl("delete-folder"),
          { Idnf: retNode!.item.Idnf }
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

  public override async DeleteFile(
    pathArgs: RootedPathResolvedArgs
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(pathArgs);
    const parentFolder = await this.getParentFolder(pathSegs);
    let retNode: IDriveItemNode | null = null;

    if (parentFolder) {
      retNode = this.getFolderFile(parentFolder, pathSegs.slice(-1)[0]) ?? null;

      if (retNode) {
        const resp = await this.svc.delete(this.getRelUrl("delete-file"), {
          Idnf: retNode!.item.Idnf,
        });

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

  protected override async fillFolderDescendants(
    prFolderId: string,
    folder: IDriveItemNode
  ): Promise<void> {
    const resp = await this.svc.get<DriveItem>(
      this.getRelUrl("folder-entries"),
      {
        idnf: folder.item.Idnf ?? [].join(this.dirSep),
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
