import trmrk_lib from "trmrk";

import { AppConfigData } from "trmrk/src/notes-app-config";
import { TrmrkBlazorApp } from "trmrk-blazor/src/app";

export const trmrkApp = new TrmrkBlazorApp<AppConfigData>();
export const trmrk = trmrk_lib;

declare const turmerikObj: any;

turmerikObj.turmerik = {
  trmrk,
  trmrkApp,
};

export const turmerik = turmerikObj.turmerik;
