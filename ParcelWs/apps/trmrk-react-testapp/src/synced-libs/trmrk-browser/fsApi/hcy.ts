import trmrk from "../../synced-libs/trmrk";

import { FsApiFolder, FsApiFile, SrcTrgPair } from "./core";

export const getDescendants = async (
  prFolderHandle: FileSystemDirectoryHandle
) => {
  const handlesArr: FileSystemHandle[] = [];

  for await (let [name, handle] of (prFolderHandle as any).entries()) {
    handlesArr.push(handle);
  }

  const foldersArr: FileSystemDirectoryHandle[] = [];
  const filesArr: FileSystemFileHandle[] = [];

  for (let handle of handlesArr) {
    if (handle.kind === "directory") {
      foldersArr.push(handle as FileSystemDirectoryHandle);
    } else {
      filesArr.push(handle as FileSystemFileHandle);
    }
  }

  const hcy = {
    name: prFolderHandle.name,
    handle: prFolderHandle,
    subFolders: foldersArr.map(
      (folder) =>
        ({
          name: folder.name,
          handle: folder,
          isFolder: true,
        } as FsApiFolder)
    ),
    folderFiles: filesArr.map(
      (file) =>
        ({
          name: file.name,
          handle: file,
          isFolder: false,
        } as FsApiFile)
    ),
  } as FsApiFolder;

  return hcy;
};

export const getDirsHcy = async (prFolderHandle: FileSystemDirectoryHandle) => {
  const hcy = await getDescendants(prFolderHandle);

  hcy.subFolders = await trmrk.mapAsync(
    hcy.subFolders,
    async (folder) => await getDirsHcy(folder.handle)
  );

  return hcy;
};

export const cloneDirsHcy = async (
  folderHandle: FileSystemDirectoryHandle,
  newPrFolderHandle: FileSystemDirectoryHandle,
  newFolderName: string | null = null,
  checkValidity: boolean | null = null
) => {
  if (checkValidity ?? true) {
    throwIfContainedInFolder(folderHandle, newPrFolderHandle);
  }

  const srcHcy = await getDirsHcy(folderHandle);

  const trgHcy = await cloneDirsHcyCore(
    srcHcy,
    newPrFolderHandle,
    newFolderName,
    false
  );

  return {
    src: srcHcy,
    trg: trgHcy,
  } as SrcTrgPair<FsApiFolder>;
};

export const cloneDirsHcyCore = async (
  srcHcyHandles: FsApiFolder,
  newPrFolderHandle: FileSystemDirectoryHandle,
  newFolderName: string | null = null,
  checkValidity: boolean | null = null
) => {
  if (checkValidity ?? true) {
    throwIfContainedInFolder(srcHcyHandles.handle, newPrFolderHandle);
  }

  newFolderName ??= srcHcyHandles.name;

  const trgFolderHandle = await newPrFolderHandle.getDirectoryHandle(
    newFolderName,
    { create: true }
  );

  const trgSubFolderHandles = await trmrk.mapAsync(
    srcHcyHandles.subFolders,
    async (folder) =>
      await cloneDirsHcyCore(folder, trgFolderHandle, null, false)
  );

  const trgHcyHandles = {
    name: trgFolderHandle.name,
    handle: trgFolderHandle,
    subFolders: trgSubFolderHandles,
  } as FsApiFolder;

  return trgHcyHandles;
};

export const throwIfContainedInFolder = async (
  prFolderHandle: FileSystemDirectoryHandle,
  folderHandle: FileSystemDirectoryHandle
) => {
  const nestedHcy = await prFolderHandle.resolve(folderHandle);

  if (nestedHcy) {
    throw new Error(
      "Cannot clone directory hierarchy inside a child directory"
    );
  }
};

export const withDirsHcy = async (
  hcy: FsApiFolder,
  action: (arg: FsApiFolder) => Promise<void>
) => {
  await action(hcy);

  for (let i = 0; i < hcy.subFolders.length; i++) {
    const iVal = i;
    await action(hcy.subFolders[iVal]);
  }
};

export const withDirsHcyCloned = async (
  obj: SrcTrgPair<FsApiFolder>,
  action: (arg: SrcTrgPair<FsApiFolder>) => Promise<void>
) => {
  await action(obj);

  for (let i = 0; i < obj.src.subFolders.length; i++) {
    const iVal = i;

    await action({
      src: obj.src.subFolders[iVal],
      trg: obj.trg.subFolders[iVal],
    });
  }
};
