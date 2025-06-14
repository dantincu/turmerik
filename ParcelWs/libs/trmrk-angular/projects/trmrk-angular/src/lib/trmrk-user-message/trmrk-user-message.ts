import {
  Component,
  Output,
  Input,
  EventEmitter,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { UserMessageLevel } from '../../trmrk/core';

import { Placement } from '../services/types';

@Component({
  selector: 'trmrk-user-message',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './trmrk-user-message.html',
  styleUrl: './trmrk-user-message.scss',
})
export class TrmrkUserMessage implements OnDestroy, OnChanges {
  @Output() trmrkClose = new EventEmitter<boolean>();
  @Input() trmrkAutoCloseMillis = 5000;
  @Input() trmrkShow = 0;
  @Input() trmrkMessage!: string;
  @Input() trmrkLevel!: UserMessageLevel;
  @Input() trmrkMsgWordBreakCharsCount = 30;
  @Input() trmrkBreakWords = false;
  @Input() trmrkArrowPlacement = Placement.None;
  @Input() trmrkArrowStyle:
    | {
        [klass: string]: any;
      }
    | null
    | undefined = null;
  messageFadeOut = false;
  show = false;

  private timeouts: NodeJS.Timeout[] = [];

  constructor() {}

  get messageParts() {
    const msgPartsCount = Math.ceil(
      this.trmrkMessage.length / this.trmrkMsgWordBreakCharsCount
    );

    const msgPartsIterable = Array.from({ length: msgPartsCount }, (_, i) => {
      const part = this.trmrkMessage.substring(
        i * this.trmrkMsgWordBreakCharsCount,
        i * this.trmrkMsgWordBreakCharsCount + this.trmrkMsgWordBreakCharsCount
      );

      return part;
    });

    const msgParts = [...msgPartsIterable];
    return msgParts;
  }

  get msgLevelCssClass() {
    let cssClass: string;

    switch (this.trmrkLevel) {
      case UserMessageLevel.Success:
        cssClass = 'trmrk-success';
        break;
      case UserMessageLevel.Info:
        cssClass = 'trmrk-info';
        break;
      case UserMessageLevel.Warn:
        cssClass = 'trmrk-warn';
        break;
      case UserMessageLevel.Error:
        cssClass = 'trmrk-error';
        break;
      default:
        throw new Error(`Invalid user message level: ${this.trmrkLevel}`);
    }

    return cssClass;
  }

  get arrowCssClass() {
    let cssClass: string;

    switch (this.trmrkArrowPlacement) {
      case Placement.None:
        cssClass = '';
        break;
      case Placement.Top:
        cssClass = 'trmrk-placement-top';
        break;
      case Placement.Right:
        cssClass = 'trmrk-placement-right';
        break;
      case Placement.Bottom:
        cssClass = 'trmrk-placement-bottom';
        break;
      case Placement.Left:
        cssClass = 'trmrk-placement-left';
        break;
      default:
        cssClass = '';
        break;
    }

    return cssClass;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const showChange = changes['trmrkShow'];
    this.show = showChange.currentValue > 0;

    if (this.show && this.trmrkAutoCloseMillis > 0) {
      this.setFadeTimeouts();
    } else {
      this.clearTimeouts();
    }
  }

  ngOnDestroy(): void {
    this.clearTimeouts();
  }

  closeButtonClick() {
    this.show = false;
    this.trmrkClose.emit(true);
  }

  setFadeTimeouts() {
    this.timeouts.push(
      setTimeout(() => {
        this.messageFadeOut = true;

        this.timeouts.push(
          setTimeout(() => {
            this.messageFadeOut = false;
            this.show = false;
            this.trmrkClose.emit(false);
          }, 1000)
        );
      }, this.trmrkAutoCloseMillis)
    );
  }

  clearTimeouts() {
    for (let tmt of this.timeouts) {
      clearTimeout(tmt);
    }

    this.timeouts.splice(0, this.timeouts.length);
  }
}
