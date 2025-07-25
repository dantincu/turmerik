import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';

import { whenChanged } from 'trmrk-angular';
import { withVal } from '../../trmrk/core';
import { getCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';
import { getElemIdx } from '../../trmrk-browser/domUtils/getDomElemBounds';

import { TrmrkContinuousPress } from '../directives/trmrk-continuous-press';
import { TrmrkAcceleratingScrollService } from '../services/trmrk-accelerating-scroll-service';

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
  providers: [TrmrkAcceleratingScrollService],
})
export class TrmrkAcceleratingScrollControl implements OnChanges {
  @Input() trmrkIntervalMillis = 500;
  @Input() trmrkIncSpeedFactor = 2;
  @Input() trmrkMinScrollStep = 500;
  @Input() trmrkScrollable!: HTMLElement;
  @Input() trmrkScrollBehavior: 'auto' | 'instant' | 'smooth' = 'smooth';

  @ViewChild('scrollUpBtn', { read: ElementRef<HTMLButtonElement> })
  scrollUpBtn!: ElementRef<HTMLButtonElement>;

  @ViewChild('fakeBtn') fakeBtn!: ElementRef<HTMLDivElement>;

  @ViewChild('scrollDownBtn', { read: ElementRef<HTMLButtonElement> })
  scrollDownBtn!: ElementRef<HTMLButtonElement>;

  constructor(
    private acceleratingScrollService: TrmrkAcceleratingScrollService
  ) {
    this.acceleratingScrollService.scrollAccElems = () => [
      this.scrollUpBtn.nativeElement,
      this.fakeBtn.nativeElement,
      this.scrollDownBtn.nativeElement,
    ];

    this.acceleratingScrollService.scrollableElem = () => this.trmrkScrollable;
  }

  ngOnChanges(changes: SimpleChanges): void {
    whenChanged(
      changes,
      () => this.trmrkIncSpeedFactor,
      (value) => (this.acceleratingScrollService.incSpeedFactor = value)
    );

    whenChanged(
      changes,
      () => this.trmrkMinScrollStep,
      (value) => (this.acceleratingScrollService.minScrollStep = value)
    );

    whenChanged(
      changes,
      () => this.trmrkScrollBehavior,
      (value) => (this.acceleratingScrollService.scrollBehavior = value)
    );
  }

  start(event: TouchEvent | MouseEvent) {
    const coords = getCoords(event);

    const scrollElems = [
      this.scrollUpBtn.nativeElement,
      this.fakeBtn.nativeElement,
      this.scrollDownBtn.nativeElement,
    ];

    const scrollDirIsDown = withVal(
      getElemIdx(scrollElems, coords),
      (scrollElemIdx) => {
        switch (scrollElemIdx) {
          case 0:
            return false;
          case 2:
            return true;
          default:
            return null;
        }
      }
    );

    this.acceleratingScrollService.reset();
    this.acceleratingScrollService.start(scrollDirIsDown);
  }

  scroll() {
    this.acceleratingScrollService.scroll();
  }

  touchOrMouseMove(event: MouseEvent | TouchEvent) {
    this.acceleratingScrollService.touchOrMouseMove(event);
  }

  reset() {
    this.acceleratingScrollService.reset();
  }
}
