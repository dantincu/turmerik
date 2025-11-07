import { Component, EventEmitter, Output, ElementRef, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { maxSafeInteger } from '../../../../trmrk/math';
import { withValIf, NullOrUndef } from '../../../../trmrk/core';
import { TrmrkTouchStartOrMouseDown } from '../../../directives/trmrk-touch-start-or-mouse-down';
import { TrmrkMultiClick } from '../../../directives/trmrk-multi-click';
import { TrmrkInfiniteHeightPanelScrollService } from '../../../services/common/trmrk-infinite-height-panel-scroll-service';

import { AppServiceBase } from '../../../services/common/app-service-base';

@Component({
  selector: 'trmrk-infinite-height-panel-scroll-control',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    TrmrkTouchStartOrMouseDown,
    TrmrkMultiClick,
  ],
  templateUrl: './trmrk-infinite-height-panel-scroll-control.html',
  styleUrl: './trmrk-infinite-height-panel-scroll-control.scss',
})
export class TrmrkInfiniteHeightPanelScrollControl {
  @Output() trmrkExpandedToggled = new EventEmitter<boolean>();
  @Input() trmrkAppSettingsChoicesCatKey: string[] | NullOrUndef;

  maxSafeInteger = maxSafeInteger;

  constructor(
    public service: TrmrkInfiniteHeightPanelScrollService,
    private hostElRef: ElementRef,
    private appService: AppServiceBase
  ) {
    setTimeout(() => {
      service.setupScrollControl({
        hostElRef: () => hostElRef,
        appSettingsChoicesCatKey: withValIf(
          this.trmrkAppSettingsChoicesCatKey,
          (key) => this.appService.getAppObjectKey(key!),
          () => null
        ),
        controlToggledEvent: () => this.trmrkExpandedToggled,
      });
    });
  }

  scrollButtonsMultiClick() {}
}
