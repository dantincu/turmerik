import { NullOrUndef } from '../../../core';

export interface ScriptCore {
  csid: string;
  name: string;
  isFolder?: boolean | NullOrUndef;
}

export interface Script<TFunc> extends ScriptCore {
  func: TFunc;
}

export interface ScriptsFolder<TFunc> extends ScriptCore {
  subFolders: ScriptsFolder<TFunc>[];
  scripts: Script<TFunc>[];
}

export interface ScriptsRootFolderCore extends ScriptCore {
  path: string | NullOrUndef;
}

export interface ScriptsRootFolder<TFunc>
  extends ScriptsFolder<TFunc>,
    ScriptsRootFolderCore {}
