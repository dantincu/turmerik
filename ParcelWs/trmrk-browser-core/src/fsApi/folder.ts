import { core as trmrk } from "trmrk";

import { FsApiFolder, SrcTrgPair } from "./core";
import { copyFile, moveFile, readFileBytes, writeToFile } from "./file";

import {
  cloneDirsHcy,
  cloneDirsHcyCore,
  getDescendantHandles,
  getHcyHandles,
  throwIfContainedInFolder,
  withDirsHcyCloned,
  withDirsHcy,
} from "./hcy";

export const copyFolderCore = async (hcy: SrcTrgPair<FsApiFolder>) => {
  await withDirsHcyCloned(hcy, async (obj) => {
    for (let i = 0; i < obj.src.folderFiles.length; i++) {
      const iVal = i;

      const file = await obj.src.folderFiles[iVal].getFile();
      await copyFile(file, obj.trg.folderHandle);
    }

    for (let i = 0; i < obj.src.subFolders.length; i++) {
      const iVal = i;

      await copyFolderCore({
        src: obj.src.subFolders[iVal],
        trg: obj.trg.subFolders[iVal],
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
      await deleteFolderCore(obj.folderHandle, obj.subFolders[iVal]);
    }

    for (let i = 0; i < obj.folderFiles.length; i++) {
      const iVal = i;
      await obj.folderHandle.removeEntry(obj.folderFiles[iVal].name);
    }

    await prFolderHandler.removeEntry(obj.folderHandle.name);
  });

  return hcy;
};

export const copyFolder = async (
  prFolderHandle: FileSystemDirectoryHandle,
  newPrFolderHandle: FileSystemDirectoryHandle,
  newFolderName: string | null = null
) => {
  newFolderName ??= prFolderHandle.name;

  const hcy = await cloneDirsHcy(
    prFolderHandle,
    newPrFolderHandle,
    newFolderName
  );

  await copyFolderCore(hcy);
  return hcy;
};

export const moveFolder = async (
  prFolderHandle: FileSystemDirectoryHandle,
  newPrFolderHandle: FileSystemDirectoryHandle,
  newFolderName: string | null = null
) => {
  newFolderName ??= prFolderHandle.name;

  const hcy = await cloneDirsHcy(
    prFolderHandle,
    newPrFolderHandle,
    newFolderName
  );

  await copyFolderCore(hcy);
  await deleteFolderCore(prFolderHandle, hcy.src);

  return hcy;
};

export const deleteFolder = async (
  prFolderHandle: FileSystemDirectoryHandle
) => {
  const hcy = await getHcyHandles(prFolderHandle);
  await deleteFolderCore(prFolderHandle, hcy);

  return hcy;
};
