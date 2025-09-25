import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatMenuModule, MatMenuTrigger, MatMenu } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TrmrkAppPage } from '../../../../trmrk-angular/components/common/trmrk-app-page/trmrk-app-page';
import { TrmrkAppLink } from '../../../../trmrk-angular/components/common/trmrk-app-link/trmrk-app-link';
import { TrmrkHorizStrip } from '../../../../trmrk-angular/components/common/trmrk-horiz-strip/trmrk-horiz-strip';

@Component({
  selector: 'trmrk-home-page',
  imports: [
    RouterModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    TrmrkAppPage,
    TrmrkAppLink,
    TrmrkHorizStrip,
  ],
  templateUrl: './trmrk-home-page.html',
  styleUrl: './trmrk-home-page.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TrmrkHomePage {
  @ViewChild('appMenuTrigger', { read: MatMenuTrigger })
  appMenuTrigger!: MatMenuTrigger;

  @ViewChild('appMenu')
  appMenu!: MatMenu;

  constructor() {
    setTimeout(() => {
      this.appMenuTrigger.menu = this.appMenu;
    });
  }

  appMenuBtnClick() {
    this.appMenuTrigger.openMenu();
  }
}
