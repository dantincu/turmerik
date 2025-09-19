import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlTree, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenu, MatMenuTrigger } from '@angular/material/menu';

import { NullOrUndef, VoidOrAny } from '../../../../trmrk/core';

import { TrmrkAppBar } from '../trmrk-app-bar/trmrk-app-bar';
import { AppStateServiceBase } from '../../../services/common/app-state-service-base';
import { AppConfigServiceBase } from '../../../services/common/app-config-service-base';

@Component({
  selector: 'trmrk-app-page',
  imports: [
    TrmrkAppBar,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './trmrk-app-page.html',
  styleUrl: './trmrk-app-page.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TrmrkAppPage implements OnDestroy {
  @Input() trmrkIsScrollableY: boolean | NullOrUndef = true;
  @Input() trmrkAppBarLeadingIconTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkAppBarBeforeTitleTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkAppBarTrailingTemplate?: TemplateRef<any> | NullOrUndef;

  @Input() trmrkAppBarHomeRouterLink:
    | string
    | readonly any[]
    | UrlTree
    | NullOrUndef;

  @Input() trmrkAppBarTitle!: string;
  @Input() trmrkAppBarCssClass: string | null = null;
  @Input() trmrkAppBarShowBackBtn: boolean | NullOrUndef;
  @Input() trmrkAppBarBackBtnClicked: (() => boolean | VoidOrAny) | NullOrUndef;

  @Input() trmrkAppBarToggleBackBtnDisabled:
    | ((disable: boolean) => boolean | VoidOrAny)
    | NullOrUndef;

  @Input() trmrkAppBarShowGoToParentBtn: boolean | NullOrUndef;
  @Input() trmrkAppBarGoToParentBtnDisabled: boolean | NullOrUndef;
  @Input() trmrkAppBarGoToParentBtnClicked: (() => VoidOrAny) | NullOrUndef;
  @Input() trmrkOptionsMenuTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkShowOptionsBtn: boolean | NullOrUndef;
  @Input() trmrkShowMainMenuTopStrip: boolean | NullOrUndef;

  @Input() trmrkShowRefreshMenuBtn: boolean | NullOrUndef;
  @Input() trmrkRefreshAction!: (() => VoidOrAny) | NullOrUndef;

  @Input() trmrkShowManageTabsMenuBtn: boolean | NullOrUndef;
  @Input() trmrkShowDupplicateTabMenuBtn: boolean | NullOrUndef;
  @Input() trmrkShowShareMenuBtn: boolean | NullOrUndef;
  @Input() trmrkShowUserProfileMenuBtn: boolean | NullOrUndef;
  @Input() trmrkShowManageAppMenuBtn: boolean | NullOrUndef;
  @Input() trmrkShowSettingsMenuBtn: boolean | NullOrUndef;
  @Input() trmrkShowHelpMenuBtn: boolean | NullOrUndef;

  @ViewChild(MatMenu) optionsMenu!: MatMenu;

  @ViewChild('optionsMenuTrigger', { read: MatMenuTrigger })
  optionsMenuTrigger!: MatMenuTrigger;

  constructor(
    public appConfigService: AppConfigServiceBase,
    public appStateService: AppStateServiceBase
  ) {
    setTimeout(() => {
      if (this.optionsMenuTrigger) {
        this.optionsMenuTrigger.menu = this.optionsMenu;
      }
    }, 0);
  }

  ngOnDestroy(): void {
    this.trmrkAppBarLeadingIconTemplate = null;
    this.trmrkAppBarBeforeTitleTemplate = null;
    this.trmrkAppBarTrailingTemplate = null;
    this.trmrkOptionsMenuTemplate = null;
  }

  optionsMenuBtnClick(event: MouseEvent): void {
    this.optionsMenuTrigger.openMenu();
  }

  refreshMenuBtnClick(event: MouseEvent): void {
    if (this.trmrkRefreshAction) {
      this.trmrkRefreshAction();
    }
  }
}
