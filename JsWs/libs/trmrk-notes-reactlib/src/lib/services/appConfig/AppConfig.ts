import { Singleton } from "@/src/trmrk/core";
import { AppConfig as AppConfigCore } from "@/src/trmrk/driveStorage/appConfig";

export interface AppConfig extends AppConfigCore {}

export const appConfig = new Singleton<AppConfig>();
