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

import { NullOrUndef } from '../../trmrk/core';

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
    | NullOrUndef = ['/'];
  @Input() trmrkAppBarTitle!: string;
  @Input() trmrkAppBarCssClass: string | null = null;
  @Input() trmrkOptionsMenuTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkShowOptionsBtn = true;
  @Input() trmrkRouteBasePath = '/app';
  @Input() trmrkIncludeSettingsMenuItem = true;

  @ViewChild(MatMenu) optionsMenu!: MatMenu;

  @ViewChild('optionsMenuTrigger', { read: MatMenuTrigger })
  optionsMenuTrigger!: MatMenuTrigger;

  constructor() {
    setTimeout(() => {
      if (this.optionsMenuTrigger) {
        this.optionsMenuTrigger.menu = this.optionsMenu;
      }
    }, 0);
  }

  optionsMenuBtnClick(event: MouseEvent): void {
    this.optionsMenuTrigger.openMenu();
  }
}
