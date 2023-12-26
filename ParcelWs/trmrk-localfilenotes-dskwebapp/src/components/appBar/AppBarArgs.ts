import { ApiResponse } from "trmrk-axios/src/core";

import { AppConfigData } from "trmrk/src/notes-app-config";

export interface AppBarArgs {
  resp: ApiResponse<AppConfigData>;
}
