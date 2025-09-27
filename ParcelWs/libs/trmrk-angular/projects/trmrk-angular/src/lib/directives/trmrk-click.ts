import { Directive, EventEmitter, Output } from '@angular/core';

import { TrmrkEventBase, TrmrkEventCoreBase } from './trmrk-event-base';

@Directive({
  selector: '[trmrkClick]',
})
export class TrmrkClick extends TrmrkEventBase<MouseEvent> {
  @Output() click = new EventEmitter<MouseEvent>();

  override get eventName(): keyof HTMLElementEventMap {
    return 'click';
  }

  override get event(): EventEmitter<MouseEvent> {
    return this.click;
  }
}
