import { NullOrUndef, VoidOrAny } from '../../../core';
import {
  Script,
  ScriptCore,
  ScriptsFolder,
  ScriptsRootFolder,
  ScriptsRootFolderCore,
} from './types';

export interface ScriptsContainer<TFunc> {
  folders: ScriptsFolder<TFunc>[];
  scripts: Script<TFunc>[];
}

export abstract class ScriptsManagerBase<TFunc> {
  rootFolder: ScriptsRootFolder<TFunc>;
  current: Script<TFunc> | null = null;

  constructor(
    rootFolder: ScriptsRootFolderCore,
    public key: string,
    public displayName?: string | NullOrUndef,
    public isEnabled?: boolean | NullOrUndef
  ) {
    this.rootFolder = {
      ...rootFolder,
      isFolder: true,
    } as unknown as ScriptsRootFolder<TFunc>;
  }

  abstract assureEntriesLoaded(folderCsid: string): Promise<ScriptCore[]>;
  abstract loadScript(scriptCsid: string): Promise<VoidOrAny>;
  abstract loadCssFile(scriptCsid: string): Promise<VoidOrAny>;

  async assureScripts(folder: ScriptsFolder<TFunc>, infiniteDepth = false) {
    if (!(folder.subFolders && folder.scripts)) {
      const entries = await this.assureEntriesLoaded(folder.csid);

      folder.subFolders ??= entries.filter(
        (ent) => ent.isFolder
      ) as ScriptsFolder<TFunc>[];

      folder.scripts ??= entries.filter(
        (ent) => !ent.isFolder
      ) as Script<TFunc>[];
    }

    if (infiniteDepth) {
      for (let subFolder of folder.subFolders) {
        await this.assureScripts(subFolder, infiniteDepth);
      }
    }
  }

  async withFolder(
    folder: ScriptsFolder<TFunc>,
    callback: (fld: ScriptsFolder<TFunc>) => Promise<boolean | NullOrUndef>
  ) {
    await this.assureScripts(folder);
    const visitChildren = await callback(folder);

    if (visitChildren) {
      for (let subFolder of folder.subFolders) {
        await this.withFolder(subFolder, callback);
      }
    }
  }

  async loadAllScripts(allScripts: Script<TFunc>[]) {
    for (let script of allScripts) {
      if (script.isEnabled) {
        this.current = script;
        await this.loadScript(script.csid);
        this.current = null;
      } else if (script.isCssFile) {
        await this.loadCssFile(script.csid);
      }
    }
  }
}

export const findEntry = <TFunc>(
  folder: ScriptsFolder<TFunc>,
  path: string | string[],
  isFolder?: boolean | NullOrUndef
): ScriptCore | null => {
  if ('string' === typeof path) {
    path = path.split('/');
  }

  const entName = path[0];
  let entry: ScriptCore | null;

  if (isFolder) {
    entry = folder.subFolders.find((fld) => fld.name === entName) ?? null;
  } else if (isFolder === false) {
    entry = folder.scripts.find((scr) => scr.name === entName) ?? null;
  } else {
    entry =
      folder.scripts.find((scr) => scr.name === entName) ??
      folder.subFolders.find((fld) => fld.name === entName) ??
      null;
  }

  if (!entry) {
    for (let subFolder of folder.subFolders) {
      entry ??= findEntry(subFolder, path, isFolder);

      if (entry) {
        break;
      }
    }
  }

  return entry;
};

export const findFolder = <TFunc>(
  folder: ScriptsFolder<TFunc>,
  path: string | string[]
) => findEntry(folder, path, true) as ScriptsFolder<TFunc> | null;

export const findScript = <TFunc>(
  folder: ScriptsFolder<TFunc>,
  path: string | string[]
) => findEntry(folder, path, false) as Script<TFunc> | null;

export type ScriptsFilterCallback<
  TFunc,
  TScriptsManager extends ScriptsManagerBase<TFunc>
> = (registrars: TScriptsManager[]) => Promise<Script<TFunc>[]>;
