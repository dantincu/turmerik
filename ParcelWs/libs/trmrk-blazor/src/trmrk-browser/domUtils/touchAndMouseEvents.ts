export const isTouchEvent = (e: MouseEvent | TouchEvent) => {
  const isTouch = !!(e as TouchEvent).touches;
  return isTouch;
};

export interface TouchOrMouseCoords {
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
  screenX: number;
  screenY: number;
}

export const getMouseCoords = (ev: MouseEvent): TouchOrMouseCoords => ({
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

export const getTouchesCoords = (tcList: TouchList) => {
  const retArr: TouchOrMouseCoords[] = [];

  for (let i = 0; i < tcList.length; i++) {
    const tc = tcList.item(i)!;
    retArr.push(getTouchCoords(tc));
  }

  return retArr;
};

export const getTouchOrMouseCoords = (ev: MouseEvent | TouchEvent) => {
  const mouseEv = ev as MouseEvent;
  const touchEv = ev as TouchEvent;

  const isTouch = !!touchEv.touches;
  let retObj: TouchOrMouseCoords | TouchOrMouseCoords[];

  if (isTouch) {
    retObj = getTouchesCoords(touchEv.touches);
  } else {
    retObj = getMouseCoords(mouseEv);
  }

  return retObj;
};

export const isSingleTouchOrClick = (
  coords: TouchOrMouseCoords | TouchOrMouseCoords[]
) => ((coords as TouchOrMouseCoords[]).length ?? 1) === 1;

export const toSingleTouchOrClick = (
  coords: TouchOrMouseCoords | TouchOrMouseCoords[]
) => {
  let retObj: TouchOrMouseCoords | null = null;
  const coordsArr = coords as TouchOrMouseCoords[];

  if (coordsArr.length === 1) {
    retObj = coordsArr[0];
  } else {
    retObj = coords as TouchOrMouseCoords | null;
  }

  return retObj;
};
