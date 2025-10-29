import { NullOrUndef } from '../../../trmrk/core';
import { mapPropNamesToThemselves } from '../../../trmrk/propNames';
import { DriveStorageOption } from '../../../trmrk/driveStorage/appConfig';

export const driveStorageOptionKeys = Object.freeze(
  mapPropNamesToThemselves({
    indexedDb: '',
    fileSystemApi: '',
    restApi: '',
    postMessage: '',
  })
);

export interface StorageUserIdnf {
  username: string;
}

export interface AppDriveStorageOption<TRootFolder = any> extends DriveStorageOption {
  rootFolder: TRootFolder;
  tmStmpMillis: number | NullOrUndef;
}
