import { Coords } from './types';
import { NullOrUndef } from '../../trmrk/core';

/**
 * From https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
 *
 * A number representing a given button:
 *
 * 0: Main button pressed, usually the left button or the un-initialized state
 *
 * 1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
 *
 * 2: Secondary button pressed, usually the right button
 *
 * 3: Fourth button, typically the Browser Back button
 *
 * 4: Fifth button, typically the Browser Forward button
 *
 */
export enum GenericMouseButton {
  Main = 0,
  Auxiliary,
  Secondary,
  Fourth,
  Fifth,
}

export enum MouseButton {
  Left = 0,
  Middle,
  Right,
  BrowserBack,
  BrowserForward,
}

export interface TouchOrMouseCoords extends Coords {
  evt?: MouseEvent | TouchEvent | NullOrUndef;
  isMouseEvt?: boolean | NullOrUndef;
  mouseButton?: number | NullOrUndef;
  pageX: number;
  pageY: number;
  screenX: number;
  screenY: number;
}

export interface TouchOrMouseMoveCoords {
  touchStartOrMouseDownCoords: TouchOrMouseCoords;
  touchOrMouseMoveCoords: TouchOrMouseCoords;
}

export const getMouseCoords = (ev: MouseEvent): TouchOrMouseCoords => ({
  isMouseEvt: true,
  mouseButton: ev.button,
  clientX: ev.clientX,
  clientY: ev.clientY,
  pageX: ev.pageX,
  pageY: ev.pageY,
  screenX: ev.screenX,
  screenY: ev.screenY,
});

export const getTouchCoords = (tc: Touch): TouchOrMouseCoords => ({
  clientX: tc.clientX,
  clientY: tc.clientY,
  pageX: tc.pageX,
  pageY: tc.pageY,
  screenX: tc.screenX,
  screenY: tc.screenY,
});

export const isTouchEvent = (e: MouseEvent | TouchEvent) => {
  const isTouch = !!(e as TouchEvent).touches;
  return isTouch;
};

export const getTouchesCoords = (tcList: TouchList) => {
  const retArr: TouchOrMouseCoords[] = [];

  for (let i = 0; i < tcList.length; i++) {
    const tc = tcList.item(i)!;
    retArr.push(getTouchCoords(tc));
  }

  return retArr;
};

export const getTouchOrMouseCoords = (
  ev: MouseEvent | TouchEvent,
  requiredButton?: number | NullOrUndef
) => {
  const mouseEv = ev as MouseEvent;
  const touchEv = ev as TouchEvent;

  const isTouch = !!(touchEv.touches || touchEv.changedTouches);
  let retObj: TouchOrMouseCoords | TouchOrMouseCoords[] | null;

  if (isTouch) {
    retObj = getTouchesCoords(touchEv.changedTouches);
  } else {
    requiredButton ??= -1;
    retObj = getMouseCoords(mouseEv);

    if (
      requiredButton >= MouseButton.Left &&
      (retObj.mouseButton ?? -1) !== -1 &&
      retObj.mouseButton !== requiredButton
    ) {
      retObj = null;
    }
  }

  return retObj;
};

export const isSingleTouchOrClick = (
  coords: TouchOrMouseCoords | TouchOrMouseCoords[] | null
) => !!coords && ((coords as TouchOrMouseCoords[]).length ?? 1) === 1;

export const toSingleTouchOrClick = (
  coords: TouchOrMouseCoords | TouchOrMouseCoords[] | null,
  ev: MouseEvent | TouchEvent,
  skipEvtAssign: boolean = true
) => {
  let retObj: TouchOrMouseCoords | null = null;
  const coordsArr = coords as TouchOrMouseCoords[];

  if (coords) {
    if (coordsArr.length === 1) {
      retObj = coordsArr[0];
    } else if ((coordsArr.length ?? -1) === -1) {
      retObj = coords as TouchOrMouseCoords | null;
    }
  }

  if (retObj && !skipEvtAssign) {
    retObj.evt = ev;
  }

  return retObj;
};

export const getSingleTouchOrClick = (
  ev: MouseEvent | TouchEvent,
  requiredButton?: number | NullOrUndef,
  skipEvtAssign: boolean = true
) =>
  toSingleTouchOrClick(
    getTouchOrMouseCoords(ev, requiredButton),
    ev,
    skipEvtAssign
  );

export const isTouchOrLeftMouseBtnClick = (coords: TouchOrMouseCoords) =>
  [MouseButton.Left, null].indexOf(coords.mouseButton ?? null) >=
  MouseButton.Left;

export const getCoords = (e: MouseEvent | TouchEvent | TouchOrMouseCoords) => {
  let retObj: Coords;
  const mouseEvent = e as MouseEvent;

  if (
    'number' === typeof mouseEvent.clientX &&
    'number' === typeof mouseEvent.clientY
  ) {
    retObj = {
      clientX: mouseEvent.clientX,
      clientY: mouseEvent.clientY,
    };
  } else {
    const touch = (e as TouchEvent).touches[0];

    retObj = {
      clientX: touch.clientX,
      clientY: touch.clientY,
    };
  }

  return retObj;
};

export interface IsContainedByArgs<TParent> {
  event: MouseEvent | TouchEvent | TouchOrMouseCoords;
  parent: TParent;
  useComposedPath?: boolean | NullOrUndef;
  coords?: Coords | NullOrUndef;
  elemAtPoint?: Element | NullOrUndef;
  composedPath?: EventTarget[] | NullOrUndef;
}

const normalizeIsContainedByArgs = <TParent>(
  args: IsContainedByArgs<TParent>
) => {
  if (args.useComposedPath) {
    args.composedPath ??= (args.event as TouchEvent).composedPath();
  } else {
    args.coords ??= getCoords(args.event);
    args.elemAtPoint ??= document.elementFromPoint(
      args.coords.clientX,
      args.coords.clientY
    );
  }
};

export const isAnyContainedBy = (args: IsContainedByArgs<HTMLElement[]>) => {
  normalizeIsContainedByArgs(args);

  const retVal = !!args.parent.find((parent) =>
    isContainedBy({ ...args, parent })
  );

  return retVal;
};

export const isContainedBy = (args: IsContainedByArgs<HTMLElement>) => {
  normalizeIsContainedByArgs(args);
  let retVal: boolean;

  if (args.useComposedPath) {
    retVal = args.composedPath!.indexOf(parent) >= 0;
  } else {
    retVal = !!args.elemAtPoint && args.parent.contains(args.elemAtPoint);
  }

  return retVal;
};
