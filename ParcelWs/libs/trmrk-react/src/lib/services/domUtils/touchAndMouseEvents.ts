import * as core from "../../../trmrk-browser/domUtils/touchAndMouseEvents";

import {
  reactEvtConverters,
  reactEvtObjConverters,
} from "./reactSyntheticEvents";

export const getMouseCoords = (ev: React.MouseEvent) =>
  core.getMouseCoords(reactEvtConverters.mouse.fromReactEvt(ev));

export const getTouchCoords = (tc: React.Touch) =>
  core.getTouchCoords(reactEvtObjConverters.touch.fromReactEvt(tc));

export const isTouchEvent = (ev: React.MouseEvent | React.TouchEvent) =>
  core.isTouchEvent(reactEvtConverters.mouseOrTouch.fromReactEvt(ev));

export const getTouchesCoords = (tcList: React.TouchList) =>
  core.getTouchesCoords(reactEvtObjConverters.touchList.fromReactEvt(tcList));

export const getTouchOrMouseCoords = (
  ev: React.MouseEvent | React.TouchEvent,
  requiredButton?: number | null | undefined
) =>
  core.getTouchOrMouseCoords(
    reactEvtConverters.mouseOrTouch.fromReactEvt(ev),
    requiredButton
  );

export const getSingleTouchOrClick = (
  ev: React.MouseEvent | React.TouchEvent,
  requiredButton?: number | null | undefined
) =>
  core.getSingleTouchOrClick(
    reactEvtConverters.mouseOrTouch.fromReactEvt(ev),
    requiredButton
  );
