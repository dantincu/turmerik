import { Params, UrlTree, Router, UrlSerializer } from '@angular/router';

import { NullOrUndef } from '../../../trmrk/core';

import {
  TouchOrMouseMoveCoords,
  TouchOrMouseCoords,
} from '../../../trmrk-browser/domUtils/touchAndMouseEvents';

export interface TrmrkDisaposable {
  dispose: () => void;
}

export enum Placement {
  None = 0,
  Top,
  Right,
  Bottom,
  Left,
}

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
  dragStartPosition: TrmrkDragStartPosition | null;
}

export interface TrmrkDragEventData extends TrmrkLongPressOrRightClickEventData {
  dragStartPosition: TrmrkDragStartPosition | null;
}

export interface TrmrkUrl {
  path: string | string[];
  queryParams?: Params | NullOrUndef;
  fragment?: string | NullOrUndef;
}

export type TrmrkUrlType = string | string[] | TrmrkUrl;

export interface TrmrkNormalizedUrlOptsCore {
  urlStr?: string | NullOrUndef;
  urlTree?: UrlTree | NullOrUndef;
  url?: TrmrkUrl | NullOrUndef;
}

export interface TrmrkNormalizedUrlOpts extends TrmrkNormalizedUrlOptsCore {
  router?: Router | NullOrUndef;
  urlSerializer: UrlSerializer;
}

export interface TrmrkNormalizedUrl {
  urlStr: string;
  urlTree: UrlTree;
  url: TrmrkUrl;
}
