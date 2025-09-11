import {
  Directive,
  EventEmitter,
  Output,
  Input,
  OnDestroy,
  ElementRef,
} from '@angular/core';

import { Subscription } from 'rxjs';

import { TouchOrMouseCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';

import { TrmrkDragEvent } from '../services/types';

import { DragService } from '../services/drag-service';

@Directive({
  selector: '[trmrkDrag]',
  providers: [DragService],
})
export class TrmrkDrag implements OnDestroy {
  @Output() trmrkDrag = new EventEmitter<TrmrkDragEvent>();
  @Output() trmrkDragStart = new EventEmitter<TouchOrMouseCoords>();
  @Output() trmrkDragEnd = new EventEmitter<TrmrkDragEvent>();

  private dragSubscription!: Subscription;
  private dragEndSubscription!: Subscription;

  constructor(
    private el: ElementRef<HTMLElement>,
    private dragService: DragService
  ) {
    this.dragService.init(el.nativeElement);
    const elem = el.nativeElement;
    this.touchStartOrMouseDown = this.touchStartOrMouseDown.bind(this);

    elem.addEventListener('mousedown', this.touchStartOrMouseDown);
    elem.addEventListener('touchstart', this.touchStartOrMouseDown);

    this.dragSubscription = this.dragService.drag.subscribe((value) =>
      this.trmrkDrag.emit(value)
    );

    this.dragEndSubscription = this.dragService.dragEnd.subscribe((value) =>
      this.trmrkDragEnd.emit(value)
    );
  }

  ngOnDestroy(): void {
    const elem = this.el.nativeElement;

    if (elem) {
      elem.removeEventListener('mousedown', this.touchStartOrMouseDown);
      elem.removeEventListener('touchstart', this.touchStartOrMouseDown);
    }

    this.dragSubscription.unsubscribe();
    this.dragEndSubscription.unsubscribe();
    this.dragService.Dispose();
  }

  private touchStartOrMouseDown(event: TouchEvent | MouseEvent) {
    const mouseOrTouchCoords = this.dragService.onTouchStartOrMouseDown(event);

    if (mouseOrTouchCoords) {
      this.trmrkDragStart.emit(mouseOrTouchCoords);
    }
  }
}
