import { configureStore } from "@reduxjs/toolkit";

import appDataReducer from "./appDataSlice";
import appBarDataSlice from "./appBarDataSlice";
import appPagesSlice from "./appPagesSlice";
import filesHcyHistorySlice from "./filesHcyHistorySlice";

export default configureStore({
  reducer: {
    appData: appDataReducer,
    appBarData: appBarDataSlice,
    appPages: appPagesSlice,
    filesHcyHistory: filesHcyHistorySlice,
  },
});
