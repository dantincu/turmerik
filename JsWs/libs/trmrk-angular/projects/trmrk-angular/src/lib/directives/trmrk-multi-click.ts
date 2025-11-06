import {
  Directive,
  HostListener,
  EventEmitter,
  Output,
  Input,
  OnDestroy,
  ElementRef,
} from '@angular/core';

import {
  MouseButton,
  TouchOrMouseCoords,
  getSingleTouchOrClick,
  isContainedBy,
} from '../../trmrk-browser/domUtils/touchAndMouseEvents';

import { MtblRefValue } from '../../trmrk/core';

import { TrmrkLongPressOrRightClickEventData } from '../services/common/types';
import { defaultLongPressTimeoutMills } from '../../trmrk-browser/core';
import { clearIntervalIfReq, clearTimeoutIfReq } from '../../trmrk-browser/domUtils/core';

export interface TrmrkMultiClickStepEventData {
  touchOrMouseCoords: TouchOrMouseCoords;
  clicksCount: number;
}

export interface TrmrkMultiClickPressAndHoldEventData {
  elapsedIntervalsCount: number;
}

@Directive({
  selector: '[trmrkMultiClick]',
})
export class TrmrkMultiClick implements OnDestroy {
  private clicksCount = 0;
  private lastClickMillis = 0;
  private lastMouseDownMillis = 0;
  private elapsedIntervalsCount = 0;

  private pressAndHoldStartTimeout: MtblRefValue<NodeJS.Timeout | null> = { value: null };
  private pressAndHoldInterval: MtblRefValue<NodeJS.Timeout | null> = { value: null };
  private mouseUpTimeout: MtblRefValue<NodeJS.Timeout | null> = { value: null };

  @Output() trmrkMultiClick = new EventEmitter<TouchOrMouseCoords>();
  @Output() trmrkMultiClickMouseUp = new EventEmitter<TrmrkMultiClickStepEventData>();
  @Output() trmrkMultiClickMouseDown = new EventEmitter<TrmrkMultiClickStepEventData>();
  @Output() trmrkMultiClickPressAndHold = new EventEmitter<TrmrkMultiClickPressAndHoldEventData>();
  @Output() trmrkMultiClickEnded = new EventEmitter<void>();
  @Input() trmrkMultiClickMillis = defaultLongPressTimeoutMills;
  @Input() trmrkPressAndHoldIntervalMillis = Math.round(defaultLongPressTimeoutMills / 4);
  @Input() trmrkMultiClicksCount = 5;

  constructor(private el: ElementRef<HTMLElement>) {
    const elem = el.nativeElement;
    this.touchStartOrMouseDown = this.touchStartOrMouseDown.bind(this);
    this.touchOrMouseMove = this.touchOrMouseMove.bind(this);
    this.touchEndOrMouseUp = this.touchEndOrMouseUp.bind(this);
    elem.addEventListener('mousedown', this.touchStartOrMouseDown);
    elem.addEventListener('touchstart', this.touchStartOrMouseDown);
  }

  ngOnDestroy(): void {
    const elem = this.el.nativeElement;

    if (elem) {
      elem.removeEventListener('mousedown', this.touchStartOrMouseDown);
      elem.removeEventListener('touchstart', this.touchStartOrMouseDown);
    }

    this.reset();
  }

  private touchStartOrMouseDown(event: TouchEvent | MouseEvent) {
    this.removeEventListeners();
    const data = this.getEventData(event);

    if (data.isValid) {
      clearTimeoutIfReq(this.mouseUpTimeout);
      const now = new Date();
      const millis = now.getTime();
      this.lastMouseDownMillis = millis;

      if (this.lastClickMillis > 0 && millis - this.lastClickMillis > this.trmrkMultiClickMillis) {
        this.resetState();
      }

      this.pressAndHoldStartTimeout.value = setTimeout(() => {
        this.firePressAndHold();

        this.pressAndHoldInterval.value = setInterval(() => {
          this.elapsedIntervalsCount++;
          this.firePressAndHold();
        }, this.trmrkPressAndHoldIntervalMillis);
      }, this.trmrkMultiClickMillis);

      document.addEventListener('mousemove', this.touchOrMouseMove, {
        capture: true,
      });

      document.addEventListener('touchmove', this.touchOrMouseMove, {
        capture: true,
      });

      document.addEventListener('mouseup', this.touchEndOrMouseUp, {
        capture: true,
      });

      document.addEventListener('touchend', this.touchEndOrMouseUp, {
        capture: true,
      });

      this.fireMultiClickMouseDown(data, this.clicksCount);
    } else {
      this.resetState();
    }
  }

  private touchOrMouseMove(event: TouchEvent | MouseEvent) {
    const data = this.getEventData(event);

    if (!data.isValid) {
      this.reset();
    }
  }

  private touchEndOrMouseUp(event: TouchEvent | MouseEvent) {
    const data = this.getEventData(event);

    if (data.isValid) {
      const now = new Date();
      const millis = now.getTime();

      this.clicksCount++;
      this.lastClickMillis = millis;

      if (millis - this.lastMouseDownMillis > this.trmrkMultiClickMillis) {
        this.reset();
      } else {
        clearTimeoutIfReq(this.pressAndHoldStartTimeout);
        clearIntervalIfReq(this.pressAndHoldInterval);

        if (this.clicksCount >= this.trmrkMultiClicksCount) {
          const clicksCount = this.clicksCount;
          this.resetCore();
          this.fireMultiClickMouseUp(data, clicksCount);
          this.trmrkMultiClick.emit(data.mouseOrTouchCoords!);
          this.trmrkMultiClickEnded.emit();
        } else {
          this.fireMultiClickMouseUp(data, this.clicksCount);
          this.mouseUpTimeout.value = setTimeout(() => {
            this.reset();
          }, this.trmrkMultiClickMillis);
        }
      }
    } else {
      this.reset();
    }
  }

  private firePressAndHold() {
    this.trmrkMultiClickPressAndHold.emit({
      elapsedIntervalsCount: this.elapsedIntervalsCount,
    });
  }

  private getEventData(event: TouchEvent | MouseEvent) {
    const data: TrmrkLongPressOrRightClickEventData = {
      elem: this.el.nativeElement,
      event,
      mouseOrTouchCoords: getSingleTouchOrClick(event, null, false),
      composedPath: null,
      isValid: false,
    };

    data.isValid = !!(data.elem && data.mouseOrTouchCoords);

    if (data.isValid) {
      const mouseButton = data.mouseOrTouchCoords!.mouseButton;
      data.isValid = (mouseButton ?? -1) <= MouseButton.Left;
    }

    if (data.isValid) {
      data.isValid = isContainedBy({ event, parent: data.elem });
    }

    return data;
  }

  private fireMultiClickMouseDown(data: TrmrkLongPressOrRightClickEventData, clicksCount: number) {
    this.trmrkMultiClickMouseDown.emit({
      touchOrMouseCoords: data.mouseOrTouchCoords!,
      clicksCount: clicksCount,
    });
  }

  private fireMultiClickMouseUp(data: TrmrkLongPressOrRightClickEventData, clicksCount: number) {
    this.trmrkMultiClickMouseUp.emit({
      touchOrMouseCoords: data.mouseOrTouchCoords!,
      clicksCount: clicksCount,
    });
  }

  private reset() {
    this.resetCore();
    this.trmrkMultiClickEnded.emit();
  }

  private resetCore() {
    this.resetStateCore();
    this.removeEventListeners();
  }

  private resetState() {
    this.resetStateCore();
    this.trmrkMultiClickEnded.emit();
  }

  private resetStateCore() {
    clearTimeoutIfReq(this.pressAndHoldStartTimeout);
    clearIntervalIfReq(this.pressAndHoldInterval);
    clearTimeoutIfReq(this.mouseUpTimeout);
    this.lastClickMillis = 0;
    this.lastMouseDownMillis = 0;
    this.clicksCount = 0;
    this.elapsedIntervalsCount = 0;
  }

  private removeEventListeners() {
    document.removeEventListener('mousemove', this.touchOrMouseMove, {
      capture: true,
    });

    document.removeEventListener('touchmove', this.touchOrMouseMove, {
      capture: true,
    });

    document.removeEventListener('mouseup', this.touchEndOrMouseUp, {
      capture: true,
    });

    document.removeEventListener('touchend', this.touchEndOrMouseUp, {
      capture: true,
    });
  }
}
