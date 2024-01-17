import { configureStore } from "@reduxjs/toolkit";

import storageOptionReducer from "./storageOptionSlice";
import appDataReducer from "./appDataSlice";
import appBarDataSlice from "./appBarDataSlice";
import appTabsDataSlice from "./appTabsDataSlice";
import filesHcyHistorySlice from "./filesHcyHistorySlice";

export default configureStore({
  reducer: {
    storageOption: storageOptionReducer,
    appData: appDataReducer,
    appBar: appBarDataSlice,
    appTabs: appTabsDataSlice,
    filesHcyHistory: filesHcyHistorySlice,
  },
});
