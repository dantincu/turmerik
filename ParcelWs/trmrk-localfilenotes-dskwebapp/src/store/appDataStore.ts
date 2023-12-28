import { configureStore } from "@reduxjs/toolkit";

import appDataReducer from "./appDataSlice";
import appBarDataSlice from "./appBarDataSlice";
import appPagesSlice from "./appPagesSlice";

export default configureStore({
  reducer: {
    appData: appDataReducer,
    appBarData: appBarDataSlice,
    appPages: appPagesSlice,
  },
});
