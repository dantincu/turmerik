import { AppConfigCore } from "@/src/trmrk/app-config";

import { DriveStorageOption } from "../driveStorage/DriveStorageOption";

export interface AppConfig extends AppConfigCore {
  driveStorageOptions: DriveStorageOption[];
}
