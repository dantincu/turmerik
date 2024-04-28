import trmrk_lib from "../../synced-libs/trmrk";

import { AppConfigData } from "../../synced-libs/trmrk/notes-app-config";
import { TrmrkBlazorApp } from "../../synced-libs/trmrk-blazor/src/app";

export const trmrkApp = new TrmrkBlazorApp<AppConfigData>();
export const trmrk = trmrk_lib;

declare const turmerikObj: any;

turmerikObj.turmerik = {
  trmrk,
  trmrkApp,
};

export const turmerik = turmerikObj.turmerik;
