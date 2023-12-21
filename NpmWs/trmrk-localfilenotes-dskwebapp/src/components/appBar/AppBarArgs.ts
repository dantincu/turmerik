import { ApiResponse, ApiConfigData } from "trmrk-axios";

import { AppConfigData } from "trmrk/src/notes-app-config";
import { AppTheme } from "../../services/app-theme/app-theme";

export interface AppBarArgs {
  appTheme: AppTheme;
  resp: ApiResponse<AppConfigData>;
  darkModeToggled: (switchToDarkMode: boolean) => void;
}
