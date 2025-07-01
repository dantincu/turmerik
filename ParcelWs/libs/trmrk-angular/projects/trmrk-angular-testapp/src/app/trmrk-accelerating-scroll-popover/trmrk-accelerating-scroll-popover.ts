import { Component, Input, ViewChild, ElementRef } from '@angular/core';
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
  @Input() trmrkIntervalMillis = 500;
  @Input() trmrkIncSpeedStepsCount = 1;
  @Input() trmrkIncSpeedFactor = 2;
  @Input() trmrkMinScrollStep = 500;
  @Input() trmrkScrollable!: HTMLElement;
  @Input() trmrkScrollBehavior: 'auto' | 'instant' | 'smooth' = 'smooth';
  @Input() trmrkLeftScrollPadAccelerates = true;
  @Input() trmrkHasCancelBtn = false;

  @ViewChild('leftScrollPad', { read: ElementRef<HTMLDivElement> })
  leftScrollPad!: ElementRef<HTMLDivElement>;

  @ViewChild('middleScrollPad', { read: ElementRef<HTMLDivElement> })
  middleScrollPad!: ElementRef<HTMLDivElement>;

  @ViewChild('rightScrollPad', { read: ElementRef<HTMLDivElement> })
  rightScrollPad!: ElementRef<HTMLDivElement>;

  @ViewChild('closeBtn', { read: ElementRef<HTMLButtonElement> })
  closeBtn!: ElementRef<HTMLButtonElement>;

  focusedPadIdx = -1;
  cancelBtnIsFocused = false;
}
