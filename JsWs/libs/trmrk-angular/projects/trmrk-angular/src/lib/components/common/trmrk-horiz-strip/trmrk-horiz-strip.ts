import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
  TemplateRef,
  ElementRef,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';

import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { encodeHtml } from '../../../../trmrk/text';
import { NullOrUndef } from '../../../../trmrk/core';
import { TouchOrMouseCoords } from '../../../../trmrk-browser/domUtils/touchAndMouseEvents';

import { TrmrkLongPressOrRightClick } from '../../../directives/trmrk-long-press-or-right-click';
import { TrmrkTouchStartOrMouseDown } from '../../../directives/trmrk-touch-start-or-mouse-down';
import { whenChanged } from '../../../services/common/simpleChanges';

export enum TrmrkHorizStripType {
  Regular,
  Scrollable,
  AppBar,
}

interface TrmrkHorizStripDetailsTextPartCore<THtml> {
  text: string;
  italic?: boolean | NullOrUndef;
  cssClass?: string | NullOrUndef;
  html?: THtml | NullOrUndef;
}

interface TrmrkHorizStripDetailsTextPartHtmlInfoCore<HTML> {
  template?: TemplateRef<any> | NullOrUndef;
  raw?: HTML | NullOrUndef;
}

type TrmrkHorizStripDetailsTextPartInternal = TrmrkHorizStripDetailsTextPartCore<
  TrmrkHorizStripDetailsTextPartHtmlInfoCore<SafeHtml>
>;

export type TrmrkHorizStripDetailsTextPartHtmlInfo =
  TrmrkHorizStripDetailsTextPartHtmlInfoCore<string>;

export type TrmrkHorizStripDetailsTextPart = TrmrkHorizStripDetailsTextPartCore<
  string | TrmrkHorizStripDetailsTextPartHtmlInfo
>;

@Component({
  selector: 'trmrk-horiz-strip',
  imports: [CommonModule, NgTemplateOutlet, TrmrkLongPressOrRightClick, TrmrkTouchStartOrMouseDown],
  templateUrl: './trmrk-horiz-strip.html',
  styleUrl: './trmrk-horiz-strip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrmrkHorizStrip implements OnChanges, OnDestroy {
  @Output() trmrkTextLongPressOrRightClick = new EventEmitter<TouchOrMouseCoords>();

  @Output() trmrkTextShortPressOrLeftClick = new EventEmitter<TouchOrMouseCoords>();

  @Output() trmrkTextTouchStartOrMouseDown = new EventEmitter<MouseEvent | TouchEvent>();

  @Input() trmrkTextLongPressAltHost: (() => HTMLElement[]) | null = null;

  @Input() trmrkType = TrmrkHorizStripType.Regular;
  @Input() trmrkMinimal = false;
  @Input() trmrkMainText!: string;
  @Input() trmrkDetailsTextParts: (string | TrmrkHorizStripDetailsTextPart)[] | null = null;
  @Input() trmrkUseNonBreakingSpaceTokens = true;
  @Input() trmrkHasCap = false;
  @Input() trmrkCssClass: string[] = [];
  @Input() trmrkCssStyle: { [key: string]: any } | null = null;
  @Input() trmrkCapCssStyle: { [key: string]: any } | null = null;
  @Input() trmrkLeadingTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkTrailingTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkTextPartDelimiterTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkUseContentInsteadOfTextRow?: boolean | NullOrUndef;

  mainText = '';
  TrmrkHorizStripType = TrmrkHorizStripType;

  constructor(public hostEl: ElementRef, private sanitizer: DomSanitizer) {}

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
      let retPart: TrmrkHorizStripDetailsTextPartInternal;

      if (typeof part === 'object') {
        retPart = part as TrmrkHorizStripDetailsTextPartInternal;
      } else {
        retPart = {
          text: encodeHtml(part ?? '', this.trmrkUseNonBreakingSpaceTokens).replaceAll(
            '\n',
            '&nbsp;'
          ),
        };
      }

      if ((retPart.html ?? null) !== null) {
        if ('string' === typeof retPart.html) {
          retPart.html = {
            raw: retPart.html,
          };
        }

        if ((retPart.html!.raw ?? null) !== null) {
          retPart.html!.raw = this.sanitizer.bypassSecurityTrustHtml(retPart.html!.raw as string);
        }
      }

      return retPart;
    });

    return detailsTextParts;
  }

  ngOnChanges(changes: SimpleChanges): void {
    whenChanged(
      changes,
      () => this.trmrkMainText,
      (value) => {
        this.mainText = encodeHtml(value ?? '', this.trmrkUseNonBreakingSpaceTokens).replaceAll(
          '\n',
          '&nbsp;'
        );
      }
    );
  }

  ngOnDestroy(): void {
    this.trmrkTextLongPressAltHost = null;
    this.trmrkDetailsTextParts = null;
    this.trmrkLeadingTemplate = null;
    this.trmrkTrailingTemplate = null;
    this.trmrkTextPartDelimiterTemplate = null;
  }
}
