export interface TouchOrMouseCoords {
  mouseButton?: number | null | undefined;
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
  screenX: number;
  screenY: number;
}

export const getMouseCoords = (ev: MouseEvent): TouchOrMouseCoords => ({
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
  requiredButton?: number | null | undefined
) => {
  const mouseEv = ev as MouseEvent;
  const touchEv = ev as TouchEvent;

  const isTouch = !!touchEv.touches;
  let retObj: TouchOrMouseCoords | TouchOrMouseCoords[] | null;

  if (isTouch) {
    retObj = getTouchesCoords(touchEv.touches);
  } else {
    requiredButton ??= -1;
    retObj = getMouseCoords(mouseEv);

    if (requiredButton >= 0 && retObj.mouseButton !== requiredButton) {
      retObj = null;
    }
  }

  return retObj;
};

export const isSingleTouchOrClick = (
  coords: TouchOrMouseCoords | TouchOrMouseCoords[] | null
) => !!coords && ((coords as TouchOrMouseCoords[]).length ?? 1) === 1;

export const toSingleTouchOrClick = (
  coords: TouchOrMouseCoords | TouchOrMouseCoords[] | null
) => {
  let retObj: TouchOrMouseCoords | null = null;
  const coordsArr = coords as TouchOrMouseCoords[];

  if (coords) {
    if (coordsArr.length === 1) {
      retObj = coordsArr[0];
    } else {
      retObj = coords as TouchOrMouseCoords | null;
    }
  }

  return retObj;
};

export const getSingleTouchOrClick = (
  ev: MouseEvent | TouchEvent,
  requiredButton?: number | null | undefined
) => toSingleTouchOrClick(getTouchOrMouseCoords(ev, requiredButton));
