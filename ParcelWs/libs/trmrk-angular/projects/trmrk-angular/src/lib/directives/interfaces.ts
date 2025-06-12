import {
  TouchOrMouseCoords,
  TouchOrMouseMoveCoords,
} from '../../trmrk-browser/domUtils/touchAndMouseEvents';

export interface TrmrkLongPressOrRightClickEventData {
  elem: HTMLElement;
  event: TouchEvent | MouseEvent;
  mouseOrTouchCoords: TouchOrMouseCoords | null;
  composedPath: EventTarget[] | null;
  isValid: boolean;
}

export interface TrmrkDragStartPosition {
  clientTop: number;
  clientLeft: number;
  offsetTop: number;
  offsetLeft: number;
}

export interface TrmrkDragEvent extends TouchOrMouseMoveCoords {
  dragStartPosition: TrmrkDragStartPosition;
}

export interface TrmrkDragEventData
  extends TrmrkLongPressOrRightClickEventData {
  dragStartPosition: TrmrkDragStartPosition;
}
