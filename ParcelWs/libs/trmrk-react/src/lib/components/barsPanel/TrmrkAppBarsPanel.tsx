import React from "react";

import AppBarsPanel, { AppBarsPanelProps } from "./AppBarsPanel";

import TextCaretPositioningTool from "../textCaretInputPositioner/TextCaretPositioningTool";

export interface TrmrkAppBarsPanelProps extends AppBarsPanelProps {
}

export default function TrmrkAppBarsPanel(props: TrmrkAppBarsPanelProps) {
  return (<AppBarsPanel {...props}>
    { props.children }

    <TextCaretPositioningTool
        appBarReducers={props.appBarReducers}
        appBarSelectors={props.appBarSelectors}
        appDataReducers={props.appDataReducers}
        appDataSelectors={props.appDataSelectors} />
  </AppBarsPanel>);
}
