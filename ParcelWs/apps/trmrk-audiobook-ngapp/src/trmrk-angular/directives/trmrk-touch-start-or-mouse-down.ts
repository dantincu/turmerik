import { Directive, ElementRef, Output, EventEmitter } from '@angular/core';

import {
  MouseEventName,
  TouchEventName,
  TrmrkTouchOrMouseEventBase,
} from './trmrk-touch-or-mouse-event-base';

@Directive({
  selector: '[trmrkTouchStartOrMouseDown]',
})
export class TrmrkTouchStartOrMouseDown extends TrmrkTouchOrMouseEventBase {
  @Output() trmrkTouchStartOrMouseDown = new EventEmitter<
    MouseEvent | TouchEvent
  >();

  override get event(): EventEmitter<MouseEvent | TouchEvent> {
    return this.trmrkTouchStartOrMouseDown;
  }

  override get mouseEvent(): MouseEventName {
    return 'mousedown';
  }

  override get touchEvent(): TouchEventName {
    return 'touchstart';
  }
}
