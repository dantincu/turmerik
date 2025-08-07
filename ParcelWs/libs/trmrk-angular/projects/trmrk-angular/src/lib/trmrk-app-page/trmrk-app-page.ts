import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlTree, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatMenuModule, MatMenu, MatMenuTrigger } from '@angular/material/menu';

import { TrmrkAppBar } from '../trmrk-app-bar/trmrk-app-bar';

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
})
export class TrmrkAppPage {
  @Input() trmrkPageTemplate: TemplateRef<any> | null | undefined;
  @Input() trmrkUseDefaultPageBody = true;
  @Input() trmrkAppBarLeadingIconTemplate?: TemplateRef<any> | null | undefined;
  @Input() trmrkAppBarHomeRouterLink:
    | string
    | readonly any[]
    | UrlTree
    | null
    | undefined = ['/'];
  @Input() trmrkAppBarTitle!: string;
  @Input() trmrkAppBarCssClass: string | null = null;
  @Input() trmrkOptionsMenuTemplate?: TemplateRef<any> | null | undefined;
  @Input() trmrkShowOptionsBtn = true;
  @Input() trmrkRouteBasePath = '/app';
  @Input() trmrkIncludeSettingsMenuItem = true;

  @ViewChild(MatMenu) optionsMenu!: MatMenu;

  @ViewChild('optionsMenuTrigger', { read: MatMenuTrigger })
  optionsMenuTrigger!: MatMenuTrigger;

  optionsMenuBtnClick(event: MouseEvent): void {
    this.optionsMenuTrigger.openMenu();
  }
}
