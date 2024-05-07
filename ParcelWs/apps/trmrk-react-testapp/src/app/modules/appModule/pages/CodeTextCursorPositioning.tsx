import React from "react";

import AppBarsPanel from "../../../../trmrk-react/components/barsPanel/AppBarsPanel";
import { appBarSelectors, appBarReducers } from "../../../store/appBarDataSlice";
import { appDataSelectors, appDataReducers } from "../../../store/appDataSlice";

export interface CodeTextCursorPositioningProps {
  urlPath: string
  basePath: string;
  rootPath: string;
}

export default function CodeTextCursorPositioning(
  props: CodeTextCursorPositioningProps
) {
  return (<AppBarsPanel basePath={props.basePath}
      appBarSelectors={appBarSelectors}
      appBarReducers={appBarReducers}
      appDataSelectors={appDataSelectors}
      appDataReducers={appDataReducers}>
    CodeTextCursorPositioning
  </AppBarsPanel>);
}
