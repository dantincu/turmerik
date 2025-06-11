import { TouchOrMouseCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';

export interface TrmrkLongPressOrRightClickEventData {
  elem: HTMLElement;
  event: TouchEvent | MouseEvent;
  mouseOrTouchCoords: TouchOrMouseCoords | null;
  composedPath: EventTarget[] | null;
  isValid: boolean;
}
