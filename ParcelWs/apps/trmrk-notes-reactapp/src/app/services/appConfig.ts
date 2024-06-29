import { Singleton } from "../../trmrk/core";
import { AppConfigData } from "../../trmrk/notes-app-config";

export const appConfig = new Singleton<AppConfigData>();
