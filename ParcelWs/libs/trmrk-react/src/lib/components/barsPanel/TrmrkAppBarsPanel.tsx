import React from "react";

import AppBarsPanel, { AppBarsPanelProps } from "./AppBarsPanel";

import TextInputCaretPositioningTool from "../textInputCaretPositioner/TextInputCaretPositioningTool";

export interface TrmrkAppBarsPanelProps extends AppBarsPanelProps {
}

export default function TrmrkAppBarsPanel(props: TrmrkAppBarsPanelProps) {
  return (<AppBarsPanel {...props}>
    { props.children }

    <TextInputCaretPositioningTool
        appBarReducers={props.appBarReducers}
        appBarSelectors={props.appBarSelectors}
        appDataReducers={props.appDataReducers}
        appDataSelectors={props.appDataSelectors} />
  </AppBarsPanel>);
}
