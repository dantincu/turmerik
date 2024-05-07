import React from "react";

import AppBarsPanel from "../../../../trmrk-react/components/barsPanel/AppBarsPanel";
import { appBarSelectors, appBarReducers } from "../../../store/appBarDataSlice";
import { appDataSelectors, appDataReducers } from "../../../store/appDataSlice";

export interface WYSIWYGTextCursorPositioningProps {
  urlPath: string
  basePath: string;
  rootPath: string;
}

export default function WYSIWYGTextCursorPositioning(
  props: WYSIWYGTextCursorPositioningProps
) {
  return (<AppBarsPanel basePath={props.basePath}
      appBarSelectors={appBarSelectors}
      appBarReducers={appBarReducers}
      appDataSelectors={appDataSelectors}
      appDataReducers={appDataReducers}>
    WYSIWYGTextCursorPositioning
  </AppBarsPanel>);
}
