import trmrk_lib from "trmrk";

import { AppConfigData } from "trmrk/src/notes-app-config";
import { TrmrkBlazorApp } from "trmrk-blazor/src/app";

export const trmrkApp = new TrmrkBlazorApp<AppConfigData>();
export const trmrk = trmrk_lib;

export const turmerik = {
  trmrk,
  trmrkApp,
};

declare const window: any;
window.turmerik = turmerik;

export default {
  turmerik,
  trmrk,
  trmrkApp,
};
