import { configureStore } from "@reduxjs/toolkit";

import appDataReducer from "./appDataSlice";
import appBarDataSlice from "./appBarDataSlice";
import appTabsDataSlice from "./appTabsDataSlice";
import filesHcyHistorySlice from "./filesHcyHistorySlice";

export default configureStore({
  reducer: {
    appData: appDataReducer,
    appBar: appBarDataSlice,
    appTabs: appTabsDataSlice,
    filesHcyHistory: filesHcyHistorySlice,
  },
});
