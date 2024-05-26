import React from "react";

import Button from "@mui/material/Button";

import { TouchOrMouseCoords } from "../../../../trmrk-browser/domUtils/touchAndMouseEvents";
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
  const btn1ElemRef = React.useRef<HTMLButtonElement | null>(null);
  const btn2ElemRef = React.useRef<HTMLButtonElement | null>(null);

  const [ btn1Elem, setBtn1Elem ] = React.useState(btn1ElemRef.current ?? null);
  const [ btn2Elem, setBtn2Elem ] = React.useState(btn2ElemRef.current ?? null);

  const longPressObj1 = longPress({
    btnElem: btn1Elem,
    afterLongPressLoopTimeoutMs: 3000,
    touchStartOrMouseDown: React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
      // console.log("touchStartOrMouseDown1", ev, coords);
    }, []),
    touchEndOrMouseUp: (ev, coords) => {
      // console.log("touchEndOrMouseUp1", ev, coords);
    },
    touchOrMouseMove: (ev, coords) => {
      // console.log("touchOrMouseMove1", ev, coords);
    },
    shortPressed: (ev, coords) => {
      // console.log("shortPressed1", ev, coords);
    },
    longPressStarted: React.useCallback(() => {
      // console.log("longPressStarted1");
      btn1ElemRef.current!.classList.add("trmrk-long-pressing");
    }, []),
    longPressEnded: React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
      // console.log("longPressEnded1", ev, coords);
      btn1ElemRef.current!.classList.remove("trmrk-long-pressing");
    }, []),
    afterLongPressLoop: () => {
      // console.log("afterLongPressLoop1");
    },
    afterLongPressLoopTimeout: () => {
      // console.log("afterLongPressLoopTimeout1");
    },
  });

  const longPressObj2 = longPress({
    btnElem: btn2Elem,
    afterLongPressLoopTimeoutMs: 3000,
    touchStartOrMouseDown: React.useCallback((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => {
      // console.log("touchStartOrMouseDown2", ev, coords);
    }, []),
    touchEndOrMouseUp: (ev, coords) => {
      // console.log("touchEndOrMouseUp2", ev, coords);
    },
    touchOrMouseMove: (ev, coords) => {
      // console.log("touchOrMouseMove2", ev, coords);
    },
    shortPressed: (ev, coords) => {
      // console.log("shortPressed2", ev, coords);
    },
    longPressStarted: React.useCallback(() => {
      // console.log("longPressStarted2");
      btn2ElemRef.current!.classList.add("trmrk-long-pressing");
    }, []),
    longPressEnded: React.useCallback((ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
      // console.log("longPressEnded2", ev, coords);
      btn2ElemRef.current!.classList.remove("trmrk-long-pressing");
    }, []),
    afterLongPressLoop: () => {
      // console.log("afterLongPressLoop2");
    },
    afterLongPressLoopTimeout: () => {
      // console.log("afterLongPressLoopTimeout2");
    },
  });

  React.useEffect(() => {
    const btn1ElemVal = btn1ElemRef.current;
    const btn2ElemVal = btn2ElemRef.current;

    if (btn1ElemVal !== btn1Elem) {
      setBtn1Elem(btn1ElemVal);
    }

    if (btn2ElemVal !== btn2Elem) {
      setBtn2Elem(btn2ElemVal);
    }

    return () => {
      longPressObj1.unregisterAll();
    }
  }, [longPressObj1, longPressObj2, btn1ElemRef, btn2ElemRef]);

  return (<AppBarsPanel basePath={props.basePath}
      appBarSelectors={appBarSelectors}
      appBarReducers={appBarReducers}
      appDataSelectors={appDataSelectors}
      appDataReducers={appDataReducers}>
    <Button disableRipple className={["trmrk-long-press-demo-btn1"].join(" ")}
      ref={el => btn1ElemRef.current = el}>Long press button</Button>
    <Button disableRipple className={["trmrk-long-press-demo-btn2"].join(" ")}
      ref={el => btn2ElemRef.current = el}>Long press button</Button>
  </AppBarsPanel>);
}
