import * as coreObj from "./src/core";
import * as notesAppConfig from "./src/notes-app-config";
import * as url from "./src/url";
import { SyncLock as SyncLockT } from "./src/sync-lock";

export const core = {
  ...coreObj,
  notesAppConfig,
  url,
};

export const SyncLock = SyncLockT;
export type SyncLock = SyncLockT;
