import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatMenuModule, MatMenu, MatMenuTrigger } from '@angular/material/menu';

import { TrmrkDrag, TrmrkDragEvent } from 'trmrk-angular';
import { TrmrkLongPressOrRightClick } from 'trmrk-angular';
import { TrmrkMultiClick } from 'trmrk-angular';
import { TrmrkUserMessage } from 'trmrk-angular';

/* import { TrmrkUserMessage } from '../trmrk-user-message/trmrk-user-message'; */

import { encodeHtml } from '../../trmrk/text';
import { UserMessageLevel } from '../../trmrk/core';
import { TouchOrMouseCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';

import { TrmrkAppIcon } from '../trmrk-app-icon/trmrk-app-icon';
import {
  TrmrkHorizStrip,
  TrmrkHorizStripType,
} from '../trmrk-horiz-strip/trmrk-horiz-strip';

@Component({
  selector: 'app-home-page',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatIconButton,
    RouterLink,
    TrmrkAppIcon,
    MatMenuModule,
    CommonModule,
    TrmrkDrag,
    TrmrkLongPressOrRightClick,
    TrmrkMultiClick,
    TrmrkUserMessage,
    TrmrkHorizStrip,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements AfterViewInit {
  @ViewChild(MatMenu) optionsMenu!: MatMenu;

  @ViewChild('optionsMenuTrigger', { read: MatMenuTrigger })
  optionsMenuTrigger!: MatMenuTrigger;

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

  showUserMsg = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

  mainUserMessageStr = '';
  showMainUserMessage = 0;
  mainUserMessageLevel = UserMessageLevel.Info;

  TrmrkHorizStripType = TrmrkHorizStripType;

  constructor() {
    setTimeout(() => {
      this.optionsMenuTrigger.menu = this.optionsMenu;
    }, 0);
  }

  ngAfterViewInit(): void {}

  onOptionsMenuBtnClick(event: MouseEvent): void {
    this.optionsMenuTrigger.openMenu();
  }

  onDrag(event: TrmrkDragEvent) {
    const draggableStripEl = this.draggableStrip.nativeElement;
    const draggableStripWidth = draggableStripEl.offsetWidth;
    const dragStartPosition = event.dragStartPosition;
    const documentElWidth = document.documentElement.scrollWidth;

    const newLeftOffset =
      dragStartPosition.offsetLeft +
      event.touchOrMouseMoveCoords.clientX -
      event.touchStartOrMouseDownCoords.clientX;

    const newRightOffset =
      documentElWidth - newLeftOffset - draggableStripWidth;

    draggableStripEl.style.right =
      Math.max(
        Math.min(newRightOffset, documentElWidth - draggableStripWidth),
        0
      ) + 'px';
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

  userMessageClose(idx: number) {
    setTimeout(() => {
      const msgElCollection =
        document.getElementsByTagName('trmrk-user-message');
      const msgEl = msgElCollection[idx];

      this.mainUserMessageStr = `Message box with index ${idx} closed and now it has
        clientHeight ${msgEl.clientHeight} and clientWidth ${msgEl.clientWidth}`;

      this.showMainUserMessage++;
      this.mainUserMessageLevel = UserMessageLevel.Info;
    }, 0);

    setTimeout(() => {
      this.showUserMsg[idx]++;
    }, 1000);
  }
}
