import {
  Directive,
  EventEmitter,
  Output,
  Input,
  OnDestroy,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { Subscription } from 'rxjs';

import { TouchOrMouseCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';

import { TrmrkDragEvent } from '../services/common/types';
import { whenChanged } from '../services/common/simpleChanges';
import { DragService } from '../services/common/drag-service';

@Directive({
  selector: '[trmrkDrag]',
  providers: [DragService],
})
export class TrmrkDrag implements OnDestroy, OnChanges {
  @Output() trmrkDrag = new EventEmitter<TrmrkDragEvent>();
  @Output() trmrkDragStart = new EventEmitter<TouchOrMouseCoords>();
  @Output() trmrkDragEnd = new EventEmitter<TrmrkDragEvent>();
  @Input() trmrkPreventDefaults = false;

  private dragSubscription!: Subscription;
  private dragEndSubscription!: Subscription;

  constructor(private el: ElementRef<HTMLElement>, private dragService: DragService) {
    this.dragService.init(el.nativeElement);
    const elem = el.nativeElement;
    this.touchStartOrMouseDown = this.touchStartOrMouseDown.bind(this);

    elem.addEventListener('mousedown', this.touchStartOrMouseDown);
    elem.addEventListener('touchstart', this.touchStartOrMouseDown);

    this.dragSubscription = this.dragService.drag.subscribe((value) => this.trmrkDrag.emit(value));

    this.dragEndSubscription = this.dragService.dragEnd.subscribe((value) =>
      this.trmrkDragEnd.emit(value)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    whenChanged(
      changes,
      () => this.trmrkPreventDefaults,
      () => {
        this.dragService.preventDefaults = this.trmrkPreventDefaults;
      }
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
  }

  private touchStartOrMouseDown(event: TouchEvent | MouseEvent) {
    const mouseOrTouchCoords = this.dragService.onTouchStartOrMouseDown(event);

    if (mouseOrTouchCoords) {
      this.trmrkDragStart.emit(mouseOrTouchCoords);
    }
  }
}
