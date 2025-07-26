import { Injectable } from '@angular/core';

import { getCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';
import { getElemIdx } from '../../trmrk-browser/domUtils/getDomElemBounds';

@Injectable()
export class TrmrkAcceleratingScrollService {
  incSpeedFactor = 2;
  minScrollStep = 40;
  scrollableElem!: () => HTMLElement;
  scrollAccElems!: () => HTMLElement[];
  scrollBehavior: 'auto' | 'instant' | 'smooth' = 'smooth';

  private accelerate = 0;
  private scrollStep = 0;

  constructor() {}

  start(scrollDirIsDown: boolean | null) {
    this.updateAccelerate(scrollDirIsDown, false, true);
    this.scrollStep = this.minScrollStep * this.accelerate;
    this.scrollCore();
  }

  scroll() {
    if (this.accelerate !== 0) {
      if (this.accelerate * this.scrollStep >= 0) {
        this.scrollStep *= this.incSpeedFactor;
      } else {
        this.scrollStep = Math.round(this.scrollStep / this.incSpeedFactor);

        if (this.scrollStep < 0) {
          this.scrollStep = Math.min(this.scrollStep, -1 * this.minScrollStep);
        } else {
          this.scrollStep = Math.max(this.scrollStep, this.minScrollStep);
        }
      }
    }

    this.scrollCore();
  }

  touchOrMouseMove(event: MouseEvent | TouchEvent) {
    const coords = getCoords(event);
    const scrollElemIdx = getElemIdx(this.scrollAccElems(), coords);
    this.updateAccelerate(scrollElemIdx, 0, 2);
  }

  reset() {
    this.scrollStep = 0;
  }

  scrollCore() {
    const scrollableElem = this.scrollableElem();
    let scrollStep = this.scrollStep;

    if (scrollStep > 0) {
      scrollStep = Math.min(
        this.scrollStep,
        scrollableElem.scrollHeight -
          scrollableElem.scrollTop -
          scrollableElem.clientHeight
      );
    } else {
      scrollStep = Math.max(this.scrollStep, -1 * scrollableElem.scrollTop);
    }

    scrollableElem.scrollBy({
      top: scrollStep,
      behavior: this.scrollBehavior,
    });
  }

  updateAccelerate<T>(value: T, deccVal: T, accVal: T) {
    switch (value) {
      case deccVal:
        this.accelerate = -1;
        break;
      case accVal:
        this.accelerate = 1;
        break;
      default:
        this.accelerate = 0;
        break;
    }
  }
}
