import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Type,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { encodeHtml } from '../../trmrk/text';

import { refreshProps } from '../services/dynamicComponent';

export enum TrmrkHorizStripType {
  Regular,
  Scrollable,
  AppBar,
}

@Component({
  selector: 'trmrk-horiz-strip',
  imports: [CommonModule],
  templateUrl: './trmrk-horiz-strip.html',
  styleUrl: './trmrk-horiz-strip.scss',
})
export class TrmrkHorizStrip implements OnChanges {
  @Input() trmrkType = TrmrkHorizStripType.Regular;
  @Input() trmrkMinimal = false;
  @Input() trmrkMainText!: string;
  @Input() trmrkDetailsTextParts: string[] | null = null;
  @Input() trmrkUseNonBreakingSpaceTokens = true;
  @Input() trmrkHasCap = true;
  @Input() cssClass: string[] = [];
  @Input() cssStyle: { [key: string]: any } | null = null;
  @Input() capCssStyle: { [key: string]: any } | null = null;
  @Input() leadingComponent: Type<any> | null = null;
  @Input() leadingComponentArgs: { [key: string]: any } | null = null;
  @Input() trailingComponent: Type<any> | null = null;
  @Input() trailingComponentArgs: { [key: string]: any } | null = null;

  @ViewChild('leadingContainer', { read: ViewContainerRef, static: true })
  leadingContainer!: ViewContainerRef;
  leadingComponentRef?: ComponentRef<any>;

  @ViewChild('trailingContainer', { read: ViewContainerRef, static: true })
  trailingContainer!: ViewContainerRef;
  trailingComponentRef?: ComponentRef<any>;

  mainText = '';

  constructor() {}

  get cssClasses() {
    let cssClasses = [...this.cssClass];

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

  ngOnChanges(changes: SimpleChanges): void {
    const mainTextChange = changes['trmrkMainText'];

    if (mainTextChange) {
      this.mainText = encodeHtml(
        mainTextChange.currentValue,
        this.trmrkUseNonBreakingSpaceTokens
      );
    }

    refreshProps(
      changes['leadingComponent'],
      changes['leadingComponentArgs'],
      this.leadingContainer,
      this.leadingComponentRef
    );

    refreshProps(
      changes['trailingComponent'],
      changes['trailingComponentArgs'],
      this.trailingContainer,
      this.trailingComponentRef
    );
  }
}
