import { configureStore } from "@reduxjs/toolkit";

import appDataReducer from "./appDataSlice";
import appBarDataReduer from "./appBarDataSlice";

export default configureStore({
  reducer: {
    appData: appDataReducer,
    appBar: appBarDataReduer,
  },
});
