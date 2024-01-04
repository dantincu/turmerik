import { core as trmrk } from "trmrk";

import { FsApiFolder, SrcTrgPair } from "./core";
import { copyFile, moveFile, readFileBytes, writeToFileCore } from "./file";

import {
  cloneDirsHcy,
  cloneDirsHcyCore,
  getDescendants,
  getDirsHcy,
  throwIfContainedInFolder,
  withDirsHcyCloned,
  withDirsHcy,
} from "./hcy";

export const copyFolderCore = async (hcy: SrcTrgPair<FsApiFolder>) => {
  await withDirsHcyCloned(hcy, async (obj) => {
    const { src, trg } = obj;
    trg.folderFiles = [];

    for (let i = 0; i < src.folderFiles.length; i++) {
      const iVal = i;

      const file = await src.folderFiles[iVal].handle.getFile();
      const fileHandle = await copyFile(file, trg.handle);

      trg.folderFiles[iVal] = {
        name: file.name,
        handle: fileHandle,
        isFolder: false,
      };
    }

    for (let i = 0; i < src.subFolders.length; i++) {
      const iVal = i;

      await copyFolderCore({
        src: src.subFolders[iVal],
        trg: trg.subFolders[iVal],
      });
    }
  });

  return hcy;
};

export const deleteFolderCore = async (
  prFolderHandler: FileSystemDirectoryHandle,
  hcy: FsApiFolder
) => {
  await withDirsHcy(hcy, async (obj) => {
    for (let i = 0; i < obj.subFolders.length; i++) {
      const iVal = i;
      await deleteFolderCore(obj.handle, obj.subFolders[iVal]);
    }

    for (let i = 0; i < obj.folderFiles.length; i++) {
      const iVal = i;
      await obj.handle.removeEntry(obj.folderFiles[iVal].name);
    }

    await prFolderHandler.removeEntry(obj.handle.name);
  });

  return hcy;
};

export const copyFolder = async (
  folderHandle: FileSystemDirectoryHandle,
  newPrFolderHandle: FileSystemDirectoryHandle,
  newFolderName: string | null = null
) => {
  newFolderName ??= folderHandle.name;

  const hcy = await cloneDirsHcy(
    folderHandle,
    newPrFolderHandle,
    newFolderName
  );

  await copyFolderCore(hcy);
  return hcy;
};

export const moveFolder = async (
  prFolderHandle: FileSystemDirectoryHandle,
  folderHandle: FileSystemDirectoryHandle,
  newPrFolderHandle: FileSystemDirectoryHandle,
  newFolderName: string | null = null
) => {
  newFolderName ??= folderHandle.name;

  const hcy = await cloneDirsHcy(
    folderHandle,
    newPrFolderHandle,
    newFolderName
  );

  await copyFolderCore(hcy);
  await deleteFolderCore(prFolderHandle, hcy.src);

  await prFolderHandle.removeEntry(folderHandle.name);
  return hcy;
};

export const deleteFolder = async (
  prFolderHandle: FileSystemDirectoryHandle,
  folderHandle: FileSystemDirectoryHandle
) => {
  const hcy = await getDirsHcy(folderHandle);
  await deleteFolderCore(prFolderHandle, hcy);

  await prFolderHandle.removeEntry(folderHandle.name);
  return hcy;
};
