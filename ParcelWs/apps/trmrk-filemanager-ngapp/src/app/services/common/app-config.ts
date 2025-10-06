import { AppConfigCore as NgAppConfigCore } from '../../../trmrk-angular/services/common/app-config';

import {
  AppConfig as AppConfigCore,
  DriveStorageOption,
  DriveStorageType,
} from '../../../trmrk/driveStorage/appConfig';

export interface AppConfig extends NgAppConfigCore, AppConfigCore {}
