import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlTree, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenu, MatMenuTrigger } from '@angular/material/menu';

import { NullOrUndef, VoidOrAny } from '../../../../trmrk/core';

import { TrmrkAppBar } from '../trmrk-app-bar/trmrk-app-bar';
import { AppStateServiceBase } from '../../../services/app-state-service-base';
import { AppConfigServiceBase } from '../../../services/app-config-service-base';

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
export class TrmrkAppPage {
  @Input() trmrkPageTemplate: TemplateRef<any> | NullOrUndef;
  @Input() trmrkUseDefaultPageBody = true;
  @Input() trmrkAppBarLeadingIconTemplate?: TemplateRef<any> | NullOrUndef;

  @Input() trmrkAppBarHomeRouterLink:
    | string
    | readonly any[]
    | UrlTree
    | NullOrUndef;

  @Input() trmrkAppBarTitle!: string;
  @Input() trmrkAppBarCssClass: string | null = null;
  @Input() trmrkOptionsMenuTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkShowOptionsBtn: boolean | NullOrUndef;
  @Input() trmrkShowMainMenuTopStrip: boolean | NullOrUndef;
  @Input() trmrkShowRefreshMenuBtn: boolean | NullOrUndef;
  @Input() trmrkRefreshAction!: (() => VoidOrAny) | NullOrUndef;
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

  optionsMenuBtnClick(event: MouseEvent): void {
    this.optionsMenuTrigger.openMenu();
  }

  refreshMenuBtnClick(event: MouseEvent): void {
    if (this.trmrkRefreshAction) {
      this.trmrkRefreshAction();
    }
  }
}
