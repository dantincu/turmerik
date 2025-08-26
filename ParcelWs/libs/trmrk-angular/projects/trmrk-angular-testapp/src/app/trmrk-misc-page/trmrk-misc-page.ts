import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import {
  TrmrkAppPage,
  TrmrkLongPressOrRightClick,
  TrmrkMultiClick,
  TrmrkDrag,
  TrmrkDragEvent,
} from 'trmrk-angular';

import { encodeHtml } from '../../trmrk/text';
import { TouchOrMouseCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';

@Component({
  selector: 'trmrk-misc-page',
  imports: [
    CommonModule,
    TrmrkAppPage,
    TrmrkLongPressOrRightClick,
    TrmrkMultiClick,
    TrmrkDrag,
    MatButtonModule,
  ],
  templateUrl: './trmrk-misc-page.html',
  styleUrl: './trmrk-misc-page.scss',
})
export class TrmrkMiscPage {
  @ViewChild('draggableStrip', { read: ElementRef })
  draggableStrip!: ElementRef;

  quote = '"';
  nonBreakingText = encodeHtml(
    'This is a    non-breaking &space example.<h5>asdfasdfasdf</h5>',
    true
  );

  longPressUserMsg1: string = '';
  longPressUserMsg2: string = '';
  multiClickUserMsg: string = '';
  popupClosedMessage = '';

  onDrag(event: TrmrkDragEvent) {
    const draggableStripEl = this.draggableStrip.nativeElement as HTMLElement;
    const draggableStripWidth = draggableStripEl.offsetWidth;
    const dragStartPosition = event.dragStartPosition;
    const containerElWidth = draggableStripEl.parentElement!.scrollWidth;

    const newLeftOffset =
      dragStartPosition!.offsetLeft +
      event.touchOrMouseMoveCoords.clientX -
      event.touchStartOrMouseDownCoords.clientX;

    let newRightOffset = containerElWidth - newLeftOffset - draggableStripWidth;

    newRightOffset = Math.max(
      Math.min(newRightOffset, containerElWidth - draggableStripWidth),
      0
    );

    draggableStripEl.style.right = newRightOffset + 'px';
  }

  onLongPressMouseDownOrTouchStart1(event: Event) {
    console.log('onLongPressMouseDownOrTouchStart1', event);
    this.longPressUserMsg1 = 'Mouse Down or Touch Start';
  }

  onLongPress1(event: TouchOrMouseCoords) {
    console.log('onLongPress1', event);
    this.longPressUserMsg1 = 'Long Press or right click';
  }

  onShortPress1(event: TouchOrMouseCoords) {
    console.log('onShortPress1', event);
    this.longPressUserMsg1 = 'Short Press';
  }

  onLongPressMouseDownOrTouchStart2(event: Event) {
    console.log('onLongPressMouseDownOrTouchStart2', event);
    this.longPressUserMsg2 = 'Mouse Down or Touch Start';
  }

  onLongPress2(event: TouchOrMouseCoords) {
    console.log('onLongPress2', event);
    this.longPressUserMsg2 = 'Long Press or right click';
  }

  onShortPress2(event: TouchOrMouseCoords) {
    console.log('onShortPress2', event);
    this.longPressUserMsg2 = 'Short Press';
  }

  onMultiClickMouseDownOrTouchStart(event: MouseEvent | TouchEvent) {
    console.log('onMultiClick', event);
    this.multiClickUserMsg = 'Mouse Down or Touch Start';
  }

  onMultiClick(event: TouchOrMouseCoords) {
    console.log('onMultiClick', event);
    this.multiClickUserMsg = 'Clicked 5 times';
  }

  openPopupWindowClick() {
    if (this.popupClosedMessage) {
      this.popupClosedMessage = '';
    } else {
      this.popupClosedMessage = '';
      const popup = window.open(
        'public/login-redirect',
        'popupWindow',
        'resizable=yes,scrollbars=yes'
      );

      if (popup) {
        const intvId = setInterval(() => {
          if (popup.closed) {
            clearInterval(intvId);
            this.popupClosedMessage = 'Popup closed';
          }
        }, 500);
      }
    }
  }
}
