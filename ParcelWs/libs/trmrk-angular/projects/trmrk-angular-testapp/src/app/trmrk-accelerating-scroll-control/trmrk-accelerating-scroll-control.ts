import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';

import { getCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';

import { TrmrkContinuousPress } from '../directives/trmrk-continuous-press';

@Component({
  selector: 'trmrk-accelerating-scroll-control',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatIconButton,
    TrmrkContinuousPress,
  ],
  templateUrl: './trmrk-accelerating-scroll-control.html',
  styleUrl: './trmrk-accelerating-scroll-control.scss',
})
export class TrmrkAcceleratingScrollControl {
  @Input() trmrkIntervalMillis = 300;
  @Input() trmrkIncSpeedStepsCount = 1;
  @Input() trmrkIncSpeedFactor = 2;
  @Input() trmrkMinScrollStep = 500;
  @Input() trmrkScrollable!: HTMLElement;
  @Input() trmrkScrollBehavior: 'auto' | 'instant' | 'smooth' = 'smooth';

  @ViewChild('scrollUpBtn', { read: ElementRef<HTMLButtonElement> })
  scrollUpBtn!: ElementRef<HTMLButtonElement>;

  @ViewChild('fakeBtn') fakeBtn!: ElementRef<HTMLDivElement>;

  @ViewChild('scrollDownBtn', { read: ElementRef<HTMLButtonElement> })
  scrollDownBtn!: ElementRef<HTMLButtonElement>;

  private accelerate = 0;
  private scrollStep = 0;
  private refCount = 0;
  private lastCount = 0;

  start(event: TouchEvent | MouseEvent) {
    this.resetCore();
    const coords = getCoords(event);
    const elem = document.elementFromPoint(coords.clientX, coords.clientY);

    if (this.fakeBtn.nativeElement.contains(elem)) {
      this.accelerate = 0;
    } else if (this.scrollUpBtn.nativeElement.contains(elem)) {
      this.accelerate = -1;
    } else if (this.scrollDownBtn.nativeElement.contains(elem)) {
      this.accelerate = 1;
    } else {
      this.accelerate = 0;
    }

    this.scrollStep = this.trmrkMinScrollStep * this.accelerate;
    this.scrollCore();
  }

  scroll(count: number) {
    if (
      this.accelerate !== 0 &&
      count - this.refCount >= this.trmrkIncSpeedStepsCount
    ) {
      if (this.accelerate * this.scrollStep >= 0) {
        this.scrollStep *= this.trmrkIncSpeedFactor;
      } else {
        this.scrollStep = Math.round(
          this.scrollStep / this.trmrkIncSpeedFactor
        );

        if (this.scrollStep < 0) {
          this.scrollStep = Math.min(
            this.scrollStep,
            -1 * this.trmrkMinScrollStep
          );
        } else {
          this.scrollStep = Math.max(this.scrollStep, this.trmrkMinScrollStep);
        }
      }

      this.refCount = count;
    }

    this.scrollCore();
    this.lastCount = count;
  }

  touchOrMouseMove(event: MouseEvent | TouchEvent) {
    const ifFakeBtn = () => {
      switch (this.accelerate) {
        case 0:
          break;
        case -1:
          this.refCount = this.lastCount;
          break;
        default:
          this.refCount = this.lastCount;
          break;
      }

      this.accelerate = 0;
    };

    const ifUpBtn = () => {
      switch (this.accelerate) {
        case -1:
          break;
        case 1:
          this.refCount = this.lastCount;
          break;
        default:
          this.refCount = this.lastCount;
          break;
      }

      this.accelerate = -1;
    };

    const ifDownBtn = () => {
      switch (this.accelerate) {
        case 1:
          break;
        case -1:
          this.refCount = this.lastCount;
          break;
        default:
          this.refCount = this.lastCount;
          break;
      }

      this.accelerate = 1;
    };

    const coords = getCoords(event);
    const elem = document.elementFromPoint(coords.clientX, coords.clientY);

    if (elem) {
      if (this.fakeBtn.nativeElement.contains(elem)) {
        ifFakeBtn();
      } else if (this.scrollUpBtn.nativeElement.contains(elem)) {
        ifUpBtn();
      } else if (this.scrollDownBtn.nativeElement.contains(elem)) {
        ifDownBtn();
      } else {
        ifFakeBtn();
      }
    }
  }

  reset(count: number) {
    this.resetCore();
  }

  resetCore() {
    this.lastCount = 0;
    this.refCount = 0;
    this.scrollStep = 0;
  }

  scrollCore() {
    this.trmrkScrollable.scrollBy({
      top: this.scrollStep,
      behavior: this.trmrkScrollBehavior,
    });
  }
}
