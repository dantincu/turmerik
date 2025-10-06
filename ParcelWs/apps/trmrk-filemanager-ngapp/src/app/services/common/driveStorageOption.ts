import { DriveStorageOption } from '../../../trmrk/driveStorage/appConfig';

export interface AppDriveStorageOption<TRootFolder = any> extends DriveStorageOption {
  rootFolder: TRootFolder;
}
