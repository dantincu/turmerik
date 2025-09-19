import { Component, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatMenuModule, MatMenuTrigger, MatMenu } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TrmrkAppPage } from '../../../../trmrk-angular/components/common/trmrk-app-page/trmrk-app-page';

import { TrmrkAppLink } from '../../../../trmrk-angular/components/common/trmrk-app-link/trmrk-app-link';

@Component({
  selector: 'trmrk-home-page',
  imports: [
    RouterModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    TrmrkAppPage,
    TrmrkAppLink,
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
