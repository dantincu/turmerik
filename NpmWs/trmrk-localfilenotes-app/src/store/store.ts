import { configureStore } from "@reduxjs/toolkit";

import { appConfigReducer } from "./app-config";
import { appThemeReducer } from "./app-theme";

export default configureStore({
  reducer: {
    appSettings: appConfigReducer,
    appTheme: appThemeReducer,
  },
});
