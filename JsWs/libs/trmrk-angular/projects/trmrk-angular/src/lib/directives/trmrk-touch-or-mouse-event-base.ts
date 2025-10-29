import { Directive, OnDestroy, AfterViewInit } from '@angular/core';

import { TrmrkEventCoreBase } from './trmrk-event-base';

export type MouseEventName = 'mousedown' | 'mousemove' | 'mouseup';
export type TouchEventName = 'touchstart' | 'touchmove' | 'touchend';
export type TouchOrMouseEventName = MouseEventName | TouchEventName;
export type TouchStartOrMouseDownEventName = 'touchstart' | 'mousedown';

@Directive()
export abstract class TrmrkTouchOrMouseEventBase
  extends TrmrkEventCoreBase<MouseEvent | TouchEvent>
  implements AfterViewInit, OnDestroy
{
  abstract get mouseEvent(): MouseEventName;
  abstract get touchEvent(): TouchEventName;

  ngAfterViewInit(): void {
    this.addEventListener(this.mouseEvent);
    this.addEventListener(this.touchEvent);
  }

  ngOnDestroy(): void {
    this.removeEventListener(this.mouseEvent);
    this.removeEventListener(this.touchEvent);
  }
}
