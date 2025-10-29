import { Component, Input, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';

@Component({
  selector: 'trmrk-accelerating-scroll-popover',
  imports: [MatIconModule, MatButtonModule, MatIconButton, CommonModule],
  templateUrl: './trmrk-accelerating-scroll-popover.html',
  styleUrl: './trmrk-accelerating-scroll-popover.scss',
})
export class TrmrkAcceleratingScrollPopover {
  @Input() trmrkHasCancelBtn = false;
  @Input() trmrkFocusedPadIdx = -1;
  @Input() trmrkCancelBtnIsFocused = false;

  constructor(public hostEl: ElementRef) {}
}
