import * as coreObj from "./core";
import * as driveItem from "./drive-item";
import * as notesAppConfig from "./notes-app-config";
import * as notesItem from "./notes-item";
import * as notesPath from "./notes-path";
import * as url from "./url";
import { SyncLock as SyncLockT } from "./sync-lock";

export const core = {
  ...coreObj,
  driveItem,
  notesAppConfig,
  notesItem,
  notesPath,
  url,
};

export const SyncLock = SyncLockT;
// export type SyncLock = SyncLockT;
