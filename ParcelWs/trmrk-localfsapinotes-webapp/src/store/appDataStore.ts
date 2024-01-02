import { configureStore } from "@reduxjs/toolkit";

import appDataReducer from "./appDataSlice";
import appBarDataSlice from "./appBarDataSlice";
import filesHcyHistorySlice from "./filesHcyHistorySlice";

export default configureStore({
  reducer: {
    appData: appDataReducer,
    appBarData: appBarDataSlice,
    filesHcyHistory: filesHcyHistorySlice,
  },
});
