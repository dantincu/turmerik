import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Checkbox from '@mui/material/Checkbox';

import { extractTextInput } from "../../../../trmrk-browser/domUtils/textInput";
import { getTouchOrMouseCoords, toSingleTouchOrClick } from "../../../../trmrk-browser/domUtils/touchAndMouseEvents";
import AppBarsPanel from "../../../../trmrk-react/components/barsPanel/AppBarsPanel";
import { appBarSelectors, appBarReducers } from "../../../store/appBarDataSlice";
import { appDataSelectors, appDataReducers } from "../../../store/appDataSlice";

import longPress from "../../../../trmrk-react/hooks/longPress";

export interface LongPressDemoPageProps {
  urlPath: string
  basePath: string;
  rootPath: string;
}

export default function LongPressDemoPage(props: LongPressDemoPageProps) {
  const btnElemRef = React.useRef<HTMLButtonElement | null>(null);

  const [ btnElem, setBtnElem ] = React.useState(btnElemRef.current ?? null);

  const longPressObj = longPress({
    btnElem: btnElem,
    afterLongPressLoopTimeoutMs: 3000,
    touchStartOrMouseDown: (ev, coords) => {
      console.log("touchStartOrMouseDown", ev, coords);
    },
    touchEndOrMouseUp: (ev, coords) => {
      console.log("touchEndOrMouseUp", ev, coords);
    },
    touchOrMouseMove: (ev, coords) => {
      console.log("touchOrMouseMove", ev, coords);
    },
    shortPressed: (ev, coords) => {
      console.log("shortPressed", ev, coords);
    },
    longPressStarted: () => {
      console.log("longPressStarted");
    },
    longPressEnded: (ev, coords) => {
      console.log("longPressEnded", ev, coords);
    },
    afterLongPressLoop: () => {
      console.log("afterLongPressLoop");
    },
    afterLongPressLoopTimeout: () => {
      console.log("afterLongPressLoopTimeout");
    },
  });

  React.useEffect(() => {
    const btnElemVal = btnElemRef.current;

    if (btnElemVal !== btnElem) {
      setBtnElem(btnElemVal);
    }

    return () => {
      longPressObj.dispose();
    }
  }, [longPressObj, btnElemRef]);

  return (<AppBarsPanel basePath={props.basePath}
      appBarSelectors={appBarSelectors}
      appBarReducers={appBarReducers}
      appDataSelectors={appDataSelectors}
      appDataReducers={appDataReducers}>
    <Button disableRipple className={["trmrk-long-press-demo-btn"].join(" ")}
      ref={el => btnElemRef.current = el}>Long press button</Button>
  </AppBarsPanel>);
}
