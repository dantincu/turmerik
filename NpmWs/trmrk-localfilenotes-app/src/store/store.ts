import { configureStore } from "@reduxjs/toolkit";

import { appSettingsReducer } from "./app-settings";
import { appThemeReducer } from "./app-theme";

export default configureStore({
  reducer: {
    appSettings: appSettingsReducer,
    appTheme: appThemeReducer,
  },
});
