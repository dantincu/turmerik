import * as coreObj from "./core";
import * as obj from "./obj";
import * as arr from "./arr";
import * as str from "./str";
import * as map from "./map";
import * as driveItem from "./drive-item";
import * as notesAppConfig from "./notes-app-config";
import * as notesItem from "./notes-item";
import * as notesPath from "./notes-path";
import * as url from "./url";
import * as syncLock from "./sync-lock";
import * as arrayAdapter from "./array-adapter";
import * as FactoryRefObj from "./FactoryRef";
import * as indexedCollection from "./indexed-collection";
import * as driveExplorerApi from "./DriveExplorerApi";

export default {
  ...coreObj,
  ...obj,
  ...arr,
  ...str,
  ...map,
  ...driveItem,
  ...notesItem,
  ...syncLock,
  notesAppConfig,
  notesPath,
  url,
  ...arrayAdapter,
  ...FactoryRefObj,

  ...indexedCollection,
  ...driveExplorerApi,
};
