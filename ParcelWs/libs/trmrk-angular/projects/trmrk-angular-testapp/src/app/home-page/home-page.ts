import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatMenuModule, MatMenu, MatMenuTrigger } from '@angular/material/menu';

import { encodeHtml } from '../../trmrk/text';
import { TouchOrMouseMoveCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';

import { TrmrkAppIcon } from '../trmrk-app-icon/trmrk-app-icon';
import { TrmrkDragEvent } from '../directives/interfaces';
import { TrmrkDrag } from '../directives/trmrk-drag';
import { TrmrkLongPressOrRightClick } from '../directives/trmrk-long-press-or-right-click';
import { TrmrkMultiClick } from '../directives/trmrk-multi-click';

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
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements AfterViewInit {
  nonBreakingText = encodeHtml(
    'This is a    non-breaking &space example.<h5>asdfasdfasdf</h5>',
    true
  );

  @ViewChild(MatMenu) optionsMenu!: MatMenu;

  @ViewChild('optionsMenuTrigger', { read: MatMenuTrigger })
  optionsMenuTrigger!: MatMenuTrigger;

  @ViewChild('draggableStrip', { read: ElementRef })
  draggableStrip!: ElementRef;

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
}
