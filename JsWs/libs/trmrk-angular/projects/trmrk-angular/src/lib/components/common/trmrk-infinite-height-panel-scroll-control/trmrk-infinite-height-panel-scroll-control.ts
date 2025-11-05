import { Component, EventEmitter, Output, ElementRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { TrmrkLongPressOrRightClick } from '../../../directives/trmrk-long-press-or-right-click';

export const MAX_SPEED_FACTOR = 13;

@Component({
  selector: 'trmrk-infinite-height-panel-scroll-control',
  imports: [MatIconModule, MatButtonModule, TrmrkLongPressOrRightClick],
  templateUrl: './trmrk-infinite-height-panel-scroll-control.html',
  styleUrl: './trmrk-infinite-height-panel-scroll-control.scss',
})
export class TrmrkInfiniteHeightPanelScrollControl {
  @Output() trmrkExpandedToggled = new EventEmitter<boolean>();
  @Output() trmrkScrollUpClicked = new EventEmitter<void>();
  @Output() trmrkScrollDownClicked = new EventEmitter<void>();
  @Output() trmrkMiddleBtnLongPressed = new EventEmitter<void>();

  isExpanded = false;
  speedFactor = 1;

  constructor(private hostElRef: ElementRef) {}

  expandBtnClicked() {
    this.isExpanded = true;
    this.trmrkExpandedToggled.emit(true);
  }

  collapseBtnClicked() {
    this.isExpanded = false;
    this.trmrkExpandedToggled.emit(false);
  }

  scrollUpClicked() {
    this.trmrkScrollUpClicked.emit();
  }

  scrollDownClicked() {
    this.trmrkScrollDownClicked.emit();
  }

  increaseScrollSpeedClicked() {
    if (this.speedFactor < MAX_SPEED_FACTOR) {
      this.speedFactor++;
    }
  }

  decreaseScrollSpeedClicked() {
    if (this.speedFactor > 1) {
      this.speedFactor--;
    }
  }

  middleBtnShortPressed() {
    this.speedFactor = 1;
  }

  middleBtnLongPressed() {
    this.speedFactor = MAX_SPEED_FACTOR;
    const hostEl = this.hostElRef.nativeElement as HTMLElement;

    if (hostEl) {
      hostEl.classList.add('trmrk-highlight');

      setTimeout(() => {
        hostEl.classList.remove('trmrk-highlight');
      }, 500);
    }

    this.trmrkMiddleBtnLongPressed.emit();
  }
}
