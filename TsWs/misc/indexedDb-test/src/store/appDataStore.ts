import { configureStore } from "@reduxjs/toolkit";

import appDataReducer from "./appDataSlice";
import appBarDataSlice from "./appBarDataSlice";

export default configureStore({
  reducer: {
    appData: appDataReducer,
    appBar: appBarDataSlice,
  },
});
