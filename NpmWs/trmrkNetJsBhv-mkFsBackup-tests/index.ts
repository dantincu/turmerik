import * as path from "path";
import * as fs from "fs";

import {
  IFsEntry,
  FsEntry,
  FsEntriesRetriever,
} from "trmrknetjsbhv-mkfsbackup";

const folderFsEntriesArrRetriever = (fsPath: string, dirSep: string) => {
  return new Promise<IFsEntry[]>((resolve, reject) => {
    fs.readdir(fsPath, (err, filesArr) => {
      if (err) {
        reject(err);
      } else {
        const entriesCount = filesArr.length;

        const entriesArr = filesArr.map(
          (file) =>
            ({
              name: file,
            } as IFsEntry)
        );

        let resolvedCount = 0;

        filesArr.forEach((entryName, idx) => {
          const entryPath = [fsPath, entryName].join(dirSep);

          fs.stat(entryPath, (err, stats) => {
            if (err) {
              reject(err);
            } else {
              entriesArr[idx] = {
                name: entryName,
                isFolder: stats.isDirectory(),
              };

              resolvedCount++;
              const allResolved = resolvedCount >= entriesCount;

              if (allResolved) {
                resolve(entriesArr);
              }
            }
          });
        });
      }
    });
  });
};

const dirSep = path.sep;
const rootPath = path.resolve(".");
const rootDirName = path.basename(rootPath);
const rootDirParentPath = path.dirname(rootPath);

let fsEntriesRetrieverFunc = async (rootFolder: FsEntry) => {
  rootFolder.include(Number.MAX_SAFE_INTEGER);
};

const getRetriever = () =>
  new FsEntriesRetriever(
    rootDirParentPath,
    rootDirName,
    dirSep,
    folderFsEntriesArrRetriever,
    fsEntriesRetrieverFunc
  );

let retriever = getRetriever();
let rootFolder = await retriever.run();
console.log(" >>>> all entries >>>> ", rootFolder);

fsEntriesRetrieverFunc = async (rootFolder: FsEntry) => {
  rootFolder.exclude();
};

retriever = getRetriever();
rootFolder = await retriever.run();
console.log(" >>>> no entries >>>> ", rootFolder);
