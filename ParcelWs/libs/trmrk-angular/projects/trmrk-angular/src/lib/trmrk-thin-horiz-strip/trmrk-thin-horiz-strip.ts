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

@Component({
  selector: 'trmrk-thin-horiz-strip',
  imports: [CommonModule, TrmrkLongPressOrRightClick],
  templateUrl: './trmrk-thin-horiz-strip.html',
  styleUrl: './trmrk-thin-horiz-strip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrmrkThinHorizStrip {
  @Output() trmrkTextLongPressOrRightClick =
    new EventEmitter<TouchOrMouseCoords>();

  @Output() trmrkTextShortPressOrLeftClick =
    new EventEmitter<TouchOrMouseCoords>();

  @Input() trmrkMinimal = false;
  @Input() trmrkText!: string;
  @Input() trmrkUseNonBreakingSpaceTokens = true;
  @Input() trmrkHasCap = true;
  @Input() trmrkCssClass: string[] = [];
  @Input() trmrkCssStyle: { [key: string]: any } | null = null;
  @Input() trmrkCapCssStyle: { [key: string]: any } | null = null;
  @Input() trmrkLeadingTemplate?: TemplateRef<any> | null | undefined;
  @Input() trmrkTrailingTemplate?: TemplateRef<any> | null | undefined;

  text = '';

  get cssClasses() {
    let cssClasses = [...this.trmrkCssClass, 'trmrk-thin-horiz-strip'];

    if (this.trmrkMinimal) {
      cssClasses.push('trmrk-minimal');
    }

    return cssClasses;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const textChange = changes['trmrkText'];

    if (textChange) {
      this.text = encodeHtml(
        textChange.currentValue ?? '',
        this.trmrkUseNonBreakingSpaceTokens
      ).replaceAll('\n', '&nbsp;');
    }
  }
}
