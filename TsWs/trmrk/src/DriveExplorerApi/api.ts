import trmrk from "../index";

import { DriveItem, FileType, OfficeFileType } from "../drive-item";

import {
  RootedPathResolvedArgs,
  IDriveItemNodeCore,
  DriveItemNodeCore,
  DriveExplorerApiBase,
  IDriveExplorerApi,
} from "./core";

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
  protected get rootDirNode(): IDriveItemNode {
    throw new Error("Method not implemented.");
  }

  public override GetFileText(
    pathArgs: RootedPathResolvedArgs
  ): Promise<string | null> {
    const pathSegs = this.getPathSegments(pathArgs);
    throw new Error("Method is not implemented");
  }

  public override CreateFolder(
    prPathArgs: RootedPathResolvedArgs,
    newFolderName: string
  ): Promise<DriveItem | null> {
    const prPathSegs = this.getPathSegments(prPathArgs);
    throw new Error("Method is not implemented");
  }

  public override DeleteFolder(
    pathArgs: RootedPathResolvedArgs
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(pathArgs);
    throw new Error("Method is not implemented");
  }

  public override CreateTextFile(
    prPathArgs: RootedPathResolvedArgs,
    newFileName: string,
    text: string
  ): Promise<DriveItem | null> {
    const prPathSegs = this.getPathSegments(prPathArgs);
    throw new Error("Method is not implemented");
  }

  public override DeleteFile(
    pathArgs: RootedPathResolvedArgs
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(pathArgs);
    throw new Error("Method is not implemented");
  }

  protected override copyOrMoveFolder(
    pathSegs: string[],
    isMove: boolean,
    newPrPathSegs?: string[] | null | undefined,
    newFolderName?: string | null | undefined
  ): Promise<DriveItem | null> {
    throw new Error("Method not implemented.");
  }

  protected override copyOrMoveFile(
    pathSegs: string[],
    isMove: boolean,
    newPrPathSegs?: string[] | null | undefined,
    newFileName?: string | null | undefined
  ): Promise<DriveItem | null> {
    throw new Error("Method not implemented.");
  }

  protected override fillFolderDescendants(
    folder: IDriveItemNode
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
