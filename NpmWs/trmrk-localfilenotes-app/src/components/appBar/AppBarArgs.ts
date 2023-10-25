import { ApiResponse } from "trmrk-axios";

import { AppSettingsData } from "../../services/settings/app-settings";
import { AppTheme } from "../../services/app-theme/app-theme";

export interface AppBarArgs {
  appTheme: AppTheme;
  resp: ApiResponse<AppSettingsData>;
  darModeToggled: (switchToDarkMode: boolean) => void;
}
