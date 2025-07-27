import { Directive, ElementRef, Output, EventEmitter } from '@angular/core';

import {
  MouseEventName,
  TouchEventName,
  TrmrkTouchOrMouseEventBase,
} from './trmrk-touch-or-mouse-event-base';

@Directive({
  selector: '[trmrkTouchOrMouseMove]',
})
export class TrmrkTouchOrMouseMove extends TrmrkTouchOrMouseEventBase {
  @Output() trmrkTouchOrMouseMove = new EventEmitter<MouseEvent | TouchEvent>();

  override get event(): EventEmitter<MouseEvent | TouchEvent> {
    return this.trmrkTouchOrMouseMove;
  }

  override get mouseEvent(): MouseEventName {
    return 'mousemove';
  }

  override get touchEvent(): TouchEventName {
    return 'touchmove';
  }
}
