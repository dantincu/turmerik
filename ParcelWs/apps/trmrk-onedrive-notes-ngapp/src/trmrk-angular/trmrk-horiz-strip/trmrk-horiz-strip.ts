import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
  TemplateRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { encodeHtml } from '../../trmrk/text';
import { TouchOrMouseCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';

import { TrmrkLongPressOrRightClick } from '../directives/trmrk-long-press-or-right-click';

export enum TrmrkHorizStripType {
  Regular,
  Scrollable,
  AppBar,
}

export interface TrmrkHorizStripDetailsTextPart {
  text: string;
  italic?: boolean | null | undefined;
  style?: { [key: string]: any } | null | undefined;
}

@Component({
  selector: 'trmrk-horiz-strip',
  imports: [CommonModule, TrmrkLongPressOrRightClick],
  templateUrl: './trmrk-horiz-strip.html',
  styleUrl: './trmrk-horiz-strip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrmrkHorizStrip implements OnChanges {
  @Output() trmrkTextLongPressOrRightClick =
    new EventEmitter<TouchOrMouseCoords>();

  @Output() trmrkTextShortPressOrLeftClick =
    new EventEmitter<TouchOrMouseCoords>();

  @Input() trmrkType = TrmrkHorizStripType.Regular;
  @Input() trmrkMinimal = false;
  @Input() trmrkMainText!: string;
  @Input() trmrkDetailsTextParts:
    | (string | TrmrkHorizStripDetailsTextPart)[]
    | null = null;
  @Input() trmrkUseNonBreakingSpaceTokens = true;
  @Input() trmrkHasCap = true;
  @Input() trmrkCssClass: string[] = [];
  @Input() trmrkCssStyle: { [key: string]: any } | null = null;
  @Input() trmrkCapCssStyle: { [key: string]: any } | null = null;
  @Input() trmrkLeadingTemplate?: TemplateRef<any> | null | undefined;
  @Input() trmrkTrailingTemplate?: TemplateRef<any> | null | undefined;

  mainText = '';
  TrmrkHorizStripType = TrmrkHorizStripType;

  constructor() {}

  get cssClasses() {
    let cssClasses = [...this.trmrkCssClass];

    switch (this.trmrkType) {
      case TrmrkHorizStripType.Scrollable:
        cssClasses.push('trmrk-horiz-scrollable-strip');
        break;
      case TrmrkHorizStripType.AppBar:
        cssClasses.push('trmrk-app-bar');
        break;
      default:
        cssClasses.push('trmrk-horiz-strip');
        break;
    }

    if (this.trmrkMinimal) {
      cssClasses.push('trmrk-minimal');
    }

    return cssClasses;
  }

  get detailsTextParts() {
    const detailsTextParts = this.trmrkDetailsTextParts?.map((part) => {
      let retPart: TrmrkHorizStripDetailsTextPart;

      if (typeof part === 'object') {
        retPart = part;
      } else {
        retPart = {
          text: part,
          italic: true,
        };
      }

      return retPart;
    });

    return detailsTextParts;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const mainTextChange = changes['trmrkMainText'];

    if (mainTextChange) {
      this.mainText = encodeHtml(
        mainTextChange.currentValue ?? '',
        this.trmrkUseNonBreakingSpaceTokens
      ).replaceAll('\n', '&nbsp;');
    }
  }
}
