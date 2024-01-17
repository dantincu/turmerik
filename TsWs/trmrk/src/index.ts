import * as coreObj from "./core";
import * as driveItem from "./drive-item";
import * as notesAppConfig from "./notes-app-config";
import * as notesItem from "./notes-item";
import * as notesPath from "./notes-path";
import * as url from "./url";
import * as syncLock from "./sync-lock";
import * as arrayAdapter from "./array-adapter";

import * as driveExplorerApi from "./DriveExplorerApi";

const core = {
  ...coreObj,
  ...driveItem,
  ...notesItem,
  ...syncLock,
  notesAppConfig,
  notesPath,
  url,
  ...arrayAdapter,

  ...driveExplorerApi,
};

export default core;
