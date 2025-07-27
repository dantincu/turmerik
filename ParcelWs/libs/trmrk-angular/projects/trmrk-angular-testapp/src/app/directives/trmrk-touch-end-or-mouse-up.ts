import { Directive, ElementRef, Output, EventEmitter } from '@angular/core';

import {
  MouseEventName,
  TouchEventName,
  TrmrkTouchOrMouseEventBase,
} from './trmrk-touch-or-mouse-event-base';

@Directive({
  selector: '[trmrkTouchEndOrMouseUp]',
})
export class TrmrkTouchEndOrMouseUp extends TrmrkTouchOrMouseEventBase {
  @Output() trmrkTouchEndOrMouseUp = new EventEmitter<
    MouseEvent | TouchEvent
  >();

  override get event(): EventEmitter<MouseEvent | TouchEvent> {
    return this.trmrkTouchEndOrMouseUp;
  }

  override get mouseEvent(): MouseEventName {
    return 'mouseup';
  }

  override get touchEvent(): TouchEventName {
    return 'touchend';
  }
}
