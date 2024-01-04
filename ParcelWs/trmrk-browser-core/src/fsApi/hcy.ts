import { core as trmrk } from "trmrk";

import { FsApiFolder, SrcTrgPair } from "./core";

export const getDescendantHandles = async (
  prFolderHandle: FileSystemDirectoryHandle
) => {
  const handlesArr: FileSystemHandle[] = [];

  for await (let kvp of (prFolderHandle as any).entries()) {
    handlesArr.push(kvp.value);
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

  const retObj = {
    folderHandle: prFolderHandle,
    subFolders: foldersArr.map(
      (folder) =>
        ({
          folderHandle: folder,
        } as FsApiFolder)
    ),
    folderFiles: filesArr,
  } as FsApiFolder;

  return retObj;
};

export const getHcyHandles = async (
  prFolderHandle: FileSystemDirectoryHandle
) => {
  const descendantsHandles = await getDescendantHandles(prFolderHandle);

  descendantsHandles.subFolders = await trmrk.mapAsync(
    descendantsHandles.subFolders,
    async (folder) => await getDescendantHandles(folder.folderHandle)
  );

  return descendantsHandles;
};

export const cloneDirsHcy = async (
  prFolderHandle: FileSystemDirectoryHandle,
  newPrFolderHandle: FileSystemDirectoryHandle,
  newFolderName: string | null = null,
  checkValidity: boolean | null = null
) => {
  if (checkValidity ?? true) {
    throwIfContainedInFolder(prFolderHandle, newPrFolderHandle);
  }

  const srcHcyHandles = await getHcyHandles(prFolderHandle);

  const trgHcyHandles = await cloneDirsHcyCore(
    srcHcyHandles,
    newPrFolderHandle,
    newFolderName,
    false
  );

  return {
    src: srcHcyHandles,
    trg: trgHcyHandles,
  } as SrcTrgPair<FsApiFolder>;
};

export const cloneDirsHcyCore = async (
  srcHcyHandles: FsApiFolder,
  newPrFolderHandle: FileSystemDirectoryHandle,
  newFolderName: string | null = null,
  checkValidity: boolean | null = null
) => {
  if (checkValidity ?? true) {
    throwIfContainedInFolder(srcHcyHandles.folderHandle, newPrFolderHandle);
  }

  newFolderName ??= srcHcyHandles.folderHandle.name;

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
    folderHandle: trgFolderHandle,
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
