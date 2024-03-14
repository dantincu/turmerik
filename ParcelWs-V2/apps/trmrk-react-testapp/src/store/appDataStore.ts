import { configureStore } from "@reduxjs/toolkit";

import appDataReducer from "./appDataSlice";
import appBarDataReduer from "./appBarDataSlice";
import devModuleIndexedDbBrowserSlice from "./devModuleIndexedDbBrowserSlice";

export default configureStore({
  reducer: {
    appData: appDataReducer,
    appBar: appBarDataReduer,
    devModuleIndexedDbBrowser: devModuleIndexedDbBrowserSlice,
  },
});
