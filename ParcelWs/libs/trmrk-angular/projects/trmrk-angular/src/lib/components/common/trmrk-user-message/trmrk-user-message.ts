import {
  Component,
  Output,
  Input,
  EventEmitter,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  ElementRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { defaultSlowAnimationDurationMillis } from '../../../../trmrk-browser/core';

import { whenChanged } from '../../../services/common/simpleChanges';
import { UserMessageLevel, NullOrUndef } from '../../../../trmrk/core';

import { Placement } from '../../../services/common/types';

@Component({
  selector: 'trmrk-user-message',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './trmrk-user-message.html',
  styleUrl: './trmrk-user-message.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TrmrkUserMessage implements OnDestroy, OnChanges {
  @Output() trmrkClose = new EventEmitter<boolean>();
  @Input() trmrkAutoCloseMillis = 5000;
  @Input() trmrkShow = 0;
  @Input() trmrkMessage!: string;
  @Input() trmrkLevel!: UserMessageLevel;
  @Input() trmrkArrowPlacement = Placement.None;
  @Input() trmrkArrowStyle:
    | {
        [klass: string]: any;
      }
    | NullOrUndef = null;

  messageFadeOut = false;
  show = false;

  private timeouts: NodeJS.Timeout[] = [];

  constructor(public hostEl: ElementRef) {}

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
    whenChanged(
      changes,
      () => this.trmrkShow,
      (value) => {
        this.show = value > 0;

        if (this.show && this.trmrkAutoCloseMillis > 0) {
          this.setFadeTimeouts();
        } else {
          this.clearTimeouts();
        }
      }
    );
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
          }, defaultSlowAnimationDurationMillis)
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
