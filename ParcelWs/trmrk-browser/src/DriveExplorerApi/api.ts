import { core as trmrk } from "trmrk";

import { DriveItem, FileType, OfficeFileType } from "trmrk/src/drive-item";

import {
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

  public override GetFileText(path: string): Promise<string | null> {
    const pathSegs = this.getPathSegments(path);
    throw new Error("Method is not implemented");
  }

  public override CreateFolder(
    prPath: string,
    newFolderName: string
  ): Promise<DriveItem | null> {
    const prPathSegs = this.getPathSegments(prPath);
    throw new Error("Method is not implemented");
  }

  public override DeleteFolder(path: string): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(path);
    throw new Error("Method is not implemented");
  }

  public override CreateTextFile(
    prPath: string,
    newFileName: string,
    text: string
  ): Promise<DriveItem | null> {
    const prPathSegs = this.getPathSegments(prPath);
    throw new Error("Method is not implemented");
  }

  public override DeleteFile(path: string): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(path);
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
