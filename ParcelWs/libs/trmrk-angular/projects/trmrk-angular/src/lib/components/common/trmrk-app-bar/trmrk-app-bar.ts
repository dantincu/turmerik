import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  EventEmitter,
  Output,
  ElementRef,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';

import { NgTemplateOutlet, CommonModule } from '@angular/common';
import { UrlTree } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { whenChanged } from '../../../services/common/simpleChanges';
import { NullOrUndef, VoidOrAny } from '../../../../trmrk/core';
import { AppConfigServiceBase } from '../../../services/common/app-config-service-base';
import { AppStateServiceBase } from '../../../services/common/app-state-service-base';
import { TrmrkAppLink } from '../trmrk-app-link/trmrk-app-link';

import { TrmrkUrlType } from '../../../services/common/types';

@Component({
  selector: 'trmrk-app-bar',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatIconButton,
    MatMenuModule,
    NgTemplateOutlet,
    TrmrkAppLink,
  ],
  templateUrl: './trmrk-app-bar.html',
  styleUrl: './trmrk-app-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TrmrkAppBar implements AfterViewInit, OnChanges, OnDestroy {
  @Output() trmrkPageTitleElem = new EventEmitter<HTMLHeadingElement>();
  @Input() trmrkLeadingTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkLeadingIconTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkBeforeTitleTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkTrailingTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkHomeRouterLink: TrmrkUrlType | NullOrUndef;
  @Input() trmrkTitle!: string;
  @Input() trmrkCssClass: string | null = null;
  @Input() trmrkShowBackBtn: boolean | NullOrUndef;
  @Input() trmrkBackBtnClicked: (() => boolean | VoidOrAny) | NullOrUndef;

  @Input() trmrkToggleBackBtnDisabled: ((disable: boolean) => boolean | VoidOrAny) | NullOrUndef;

  @Input() trmrkShowGoToParentBtn: boolean | NullOrUndef;
  @Input() trmrkGoToParentBtnDisabled: boolean | NullOrUndef;
  @Input() trmrkGoToParentBtnClicked: (() => VoidOrAny) | NullOrUndef;

  @ViewChild('pageTitle', { read: ElementRef })
  pageTitle!: ElementRef;

  backBtnDisabled!: boolean;

  constructor(
    public hostEl: ElementRef,
    public appConfigService: AppConfigServiceBase,
    public appStateService: AppStateServiceBase
  ) {
    this.updateBackBtnDisabled();
  }

  ngAfterViewInit(): void {
    this.trmrkPageTitleElem.emit(this.pageTitle.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    whenChanged(
      changes,
      () => this.trmrkToggleBackBtnDisabled,
      () => {
        this.updateBackBtnDisabled();
      }
    );
  }

  ngOnDestroy(): void {
    this.trmrkLeadingIconTemplate = null;
    this.trmrkBeforeTitleTemplate = null;
    this.trmrkTrailingTemplate = null;
  }

  backBtnClicked(event: MouseEvent) {
    let doNotPopHistory = false;

    if (this.trmrkBackBtnClicked) {
      doNotPopHistory = this.trmrkBackBtnClicked();
    }

    if (!doNotPopHistory) {
      window.history.back();
      this.updateBackBtnDisabled();
    }
  }

  goToParentBtnClicked(event: MouseEvent) {
    if (this.trmrkGoToParentBtnClicked) {
      this.trmrkGoToParentBtnClicked();
    }
  }

  shouldBackBtnBeDisabled() {
    let shouldBeDisabled = window.history.length <= 1;

    if (this.trmrkToggleBackBtnDisabled) {
      shouldBeDisabled = this.trmrkToggleBackBtnDisabled(shouldBeDisabled) ?? shouldBeDisabled;
    }

    return shouldBeDisabled;
  }

  updateBackBtnDisabled() {
    this.backBtnDisabled = this.shouldBackBtnBeDisabled();
  }
}
