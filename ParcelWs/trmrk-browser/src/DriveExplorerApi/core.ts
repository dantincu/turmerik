import { core as trmrk } from "trmrk";

import { DriveItem, FileType, OfficeFileType } from "trmrk/src/drive-item";

export interface IDriveExplorerApi {
  GetItem: (idnf: string) => Promise<DriveItem | null>;
  GetFolder: (idnf: string) => Promise<DriveItem | null>;
  ItemExists: (idnf: string) => Promise<boolean>;
  FolderExists: (idnf: string) => Promise<boolean>;
  FileExists: (idnf: string) => Promise<boolean>;
  GetFileText: (idnf: string) => Promise<string | null>;
  GetDriveFolderWebUrl: (idnf: string) => Promise<string | null>;
  GetDriveFileWebUrl: (idnf: string) => Promise<string | null>;
  CreateFolder: (
    prIdnf: string,
    newFolderName: string
  ) => Promise<DriveItem | null>;
  RenameFolder: (
    idnf: string,
    newFolderName: string
  ) => Promise<DriveItem | null>;
  CopyFolder: (
    idnf: string,
    newPrIdnf: string,
    newFolderName: string
  ) => Promise<DriveItem | null>;
  MoveFolder: (
    idnf: string,
    newPrIdnf: string,
    newFolderName: string
  ) => Promise<DriveItem | null>;
  DeleteFolder: (idnf: string) => Promise<DriveItem | null>;
  CreateTextFile: (
    prIdnf: string,
    newFileName: string,
    text: string
  ) => Promise<DriveItem | null>;
  CreateOfficeLikeFile: (
    prIdnf: string,
    newFileName: string,
    officeLikeFileType: OfficeFileType
  ) => Promise<DriveItem | null>;
  RenameFile: (idnf: string, newFileName: string) => Promise<DriveItem | null>;
  CopyFile: (
    idnf: string,
    newPrIdnf: string,
    newFileName: string
  ) => Promise<DriveItem | null>;
  MoveFile: (
    idnf: string,
    newPrIdnf: string,
    newFileName: string
  ) => Promise<DriveItem | null>;
  DeleteFile: (idnf: string) => Promise<DriveItem | null>;
}

export class DriveExplorerApi implements IDriveExplorerApi {
  public GetItem(idnf: string): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(idnf);
    throw new Error("Method is not implemented");
  }

  public GetFolder(idnf: string): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(idnf);
    throw new Error("Method is not implemented");
  }

  public ItemExists(idnf: string): Promise<boolean> {
    const pathSegs = this.getPathSegments(idnf);
    throw new Error("Method is not implemented");
  }

  public FolderExists(idnf: string): Promise<boolean> {
    const pathSegs = this.getPathSegments(idnf);
    throw new Error("Method is not implemented");
  }

  public FileExists(idnf: string): Promise<boolean> {
    const pathSegs = this.getPathSegments(idnf);
    throw new Error("Method is not implemented");
  }

  public GetFileText(idnf: string): Promise<string | null> {
    const pathSegs = this.getPathSegments(idnf);
    throw new Error("Method is not implemented");
  }

  public GetDriveFolderWebUrl(idnf: string): Promise<string | null> {
    throw new Error("Method GetDriveFolderWebUrl is not supported");
  }

  public GetDriveFileWebUrl(idnf: string): Promise<string | null> {
    throw new Error("Method GetDriveFileWebUrl is not supported");
  }

  public CreateFolder(
    prIdnf: string,
    newFolderName: string
  ): Promise<DriveItem | null> {
    const prPathSegs = this.getPathSegments(prIdnf);
    throw new Error("Method is not implemented");
  }

  public RenameFolder(
    idnf: string,
    newFolderName: string
  ): Promise<DriveItem | null> {
    const prPathSegs = this.getPathSegments(idnf);
    throw new Error("Method is not implemented");
  }

  public CopyFolder(
    idnf: string,
    newPrIdnf: string,
    newFolderName: string
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(idnf);
    const newPrPathSegs = this.getPathSegments(newPrIdnf);
    throw new Error("Method is not implemented");
  }

  public MoveFolder(
    idnf: string,
    newPrIdnf: string,
    newFolderName: string
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(idnf);
    const newPrPathSegs = this.getPathSegments(newPrIdnf);
    throw new Error("Method is not implemented");
  }

  public DeleteFolder(idnf: string): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(idnf);
    throw new Error("Method is not implemented");
  }

  public CreateTextFile(
    prIdnf: string,
    newFileName: string,
    text: string
  ): Promise<DriveItem | null> {
    const prPathSegs = this.getPathSegments(prIdnf);
    throw new Error("Method is not implemented");
  }

  public CreateOfficeLikeFile(
    prIdnf: string,
    newFileName: string,
    officeLikeFileType: OfficeFileType
  ): Promise<DriveItem | null> {
    const prPathSegs = this.getPathSegments(prIdnf);
    throw new Error("Method is not implemented");
  }

  public RenameFile(
    idnf: string,
    newFileName: string
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(idnf);
    throw new Error("Method is not implemented");
  }

  public CopyFile(
    idnf: string,
    newPrIdnf: string,
    newFileName: string
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(idnf);
    const newPrPathSegs = this.getPathSegments(newPrIdnf);
    throw new Error("Method is not implemented");
  }

  public MoveFile(
    idnf: string,
    newPrIdnf: string,
    newFileName: string
  ): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(idnf);
    const newPrPathSegs = this.getPathSegments(newPrIdnf);
    throw new Error("Method is not implemented");
  }

  public DeleteFile(idnf: string): Promise<DriveItem | null> {
    const pathSegs = this.getPathSegments(idnf);
    throw new Error("Method is not implemented");
  }

  private getPathSegments(idnf: string) {
    const segments = getPathSegments(idnf);
    return segments;
  }
}

export const getPathSegments = (idnf: string) => {
  const segments = idnf
    .split("/")
    .filter((seg) => trmrk.isNonEmptyStr(seg, true));

  for (let seg of segments) {
    if (seg.trim() != seg || seg.endsWith(".")) {
      throw new Error(
        "Path segments are not allowed to end with the dot symbol or start or end with whitespace"
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
