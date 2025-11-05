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
  Inject,
} from '@angular/core';

import { NgTemplateOutlet, CommonModule } from '@angular/common';
import { UrlTree, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { whenChanged } from '../../../services/common/simpleChanges';
import { NullOrUndef, VoidOrAny } from '../../../../trmrk/core';
import { injectionTokens } from '../../../services/dependency-injection/injection-tokens';
import { NgAppConfigCore } from '../../../services/common/app-config';
import { AppStateServiceBase } from '../../../services/common/app-state-service-base';
import { TrmrkObservable } from '../../../services/common/TrmrkObservable';
import { TrmrkAppLink } from '../trmrk-app-link/trmrk-app-link';
import { TrmrkUrlType } from '../../../services/common/types';

@Component({
  selector: 'trmrk-app-bar',
  imports: [
    CommonModule,
    RouterModule,
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
  @Input() trmrkHomePageRouterLink?: TrmrkUrlType | NullOrUndef;
  @Input() trmrkLeadingTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkBeforeTitleTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkTrailingTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkTitle!: string;
  @Input() trmrkCssClass: string | null = null;
  @Input() trmrkShowBackBtn?: boolean | NullOrUndef;
  @Input() trmrkBackBtnClicked?: (() => boolean | VoidOrAny) | NullOrUndef;

  @Input() trmrkToggleBackBtnDisabled?: ((disable: boolean) => boolean | VoidOrAny) | NullOrUndef;

  @Input() trmrkShowGoToParentBtn?: boolean | NullOrUndef;
  @Input() trmrkGoToParentBtnDisabled?: boolean | NullOrUndef;
  @Input() trmrkGoToParentBtnClicked?: (() => VoidOrAny) | NullOrUndef;
  @Input() trmrkGoToParentRouterLink?: string | readonly any[] | UrlTree | NullOrUndef;

  @ViewChild('pageTitle', { read: ElementRef })
  pageTitle!: ElementRef;

  backBtnDisabled!: boolean;

  constructor(
    public hostEl: ElementRef,
    @Inject(injectionTokens.appConfig.token) public appConfig: TrmrkObservable<NgAppConfigCore>,
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
