import { NullOrUndef } from '../../../trmrk/core';
import { DriveStorageOption } from '../../../trmrk/driveStorage/appConfig';

export interface StorageUserIdnf {
  username: string;
}

export interface AppDriveStorageOption<TRootFolder = any> extends DriveStorageOption {
  rootFolder: TRootFolder;
  tmStmpMillis: number | NullOrUndef;
}
