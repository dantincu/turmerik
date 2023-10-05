import * as path from "path";
import * as fs from "fs";

import {
  IFsEntry,
  FsEntry,
  FsEntriesRetriever,
  contains,
  any,
} from "trmrknetjsbhv-mkfsbackup";

const folderFsEntriesArrRetriever = (fsPath: string, dirSep: string) => {
  return new Promise<IFsEntry[]>((resolve, reject) => {
    fs.readdir(fsPath, (err, filesArr) => {
      if (err) {
        reject(err);
      } else {
        const entriesCount = filesArr.length;

        if (entriesCount > 0) {
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
        } else {
          resolve([]);
        }
      }
    });
  });
};

const serializeFolderCore = (fsEntry: FsEntry, pathsArr: string[]) => {
  const fsPath = [fsEntry.parentDirPath, fsEntry.name].join(fsEntry.dirSepStr);

  if (fsEntry.isIncluded) {
    pathsArr.push(fsPath);
  }

  fsEntry.childNodes?.forEach((childNode) => {
    serializeFolderCore(childNode, pathsArr);
  });

  return pathsArr;
};

const serializeFolder = (fsEntry: FsEntry) =>
  serializeFolderCore(fsEntry, []).join("\n");

const dirSep = path.sep;

let forEachChildCallback = async (
  item: FsEntry,
  idx: number,
  arr: FsEntry[]
) => {
  await item.parent.include(Number.MAX_SAFE_INTEGER);
  // await item.parent.include(0);
};

const getRetriever = (rootPath: string | null = null) => {
  rootPath ??= ".";
  rootPath = path.resolve(rootPath);
  const rootDirName = path.basename(rootPath);
  const rootDirParentPath = path.dirname(rootPath);

  const retriever = new FsEntriesRetriever(
    rootDirParentPath,
    rootDirName,
    dirSep,
    folderFsEntriesArrRetriever,
    forEachChildCallback
  );

  return retriever;
};

let retriever = getRetriever();
// let allEntries = await retriever.run();
// console.log(" >>>> all entries >>>> ", serializeFolder(allEntries));

forEachChildCallback = async (item: FsEntry, idx: number, arr: FsEntry[]) => {
  item.parent.exclude();
};

retriever = getRetriever();
const noEntries = await retriever.run();
console.log(" >>>> no entries >>>> ", serializeFolder(noEntries));

forEachChildCallback = async (item: FsEntry, idx: number, arr: FsEntry[]) => {
  const entriesToInclude = ["node_modules", "package.json"];
  const namesArr = arr.map((itm) => itm.name);

  const matching = namesArr.filter(
    (name) => entriesToInclude.indexOf(name) >= 0
  );

  if (matching.length > 0) {
    if (entriesToInclude.indexOf(item.name) >= 0) {
      await item.include(0);
      item.excludeUnresolved();
    } else {
      item.exclude();
    }
  } else {
    if (item.isFolder) {
      await item.forEachChild(forEachChildCallback);
      item.excludeUnresolved();
    } else {
      item.exclude();
    }
  }
};

retriever = getRetriever();
const someEntries = await retriever.run();
console.log(" >>>> some entries >>>> ", serializeFolder(someEntries));

const excludedDirNames = [".git", ".vs", "node_modules"];
const excludedNetDirNames = ["bin", "obj"];
const netCsprojExtn = ".csproj";

forEachChildCallback = async (item: FsEntry, idx: number, arr: FsEntry[]) => {
  if (item.isFolder) {
    let exclude =
      contains(excludedDirNames, item.name) ||
      (any(arr, (sibbling) => sibbling.name.endsWith(netCsprojExtn)) &&
        contains(excludedNetDirNames, item.name));

    if (exclude) {
      item.exclude();
    } else {
      await item.include();
      await item.forEachChild(forEachChildCallback);
    }
  } else {
    await item.include();
  }
};

try {
  retriever = getRetriever("../");
  const theEntries = await retriever.run();
  console.log(" >>>> the entries >>>> ", serializeFolder(theEntries));
} catch (err) {
  throw err;
}
