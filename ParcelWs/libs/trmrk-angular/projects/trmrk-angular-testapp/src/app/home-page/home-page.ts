import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatMenuModule, MatMenu, MatMenuTrigger } from '@angular/material/menu';

import { TrmrkAppIcon } from '../trmrk-app-icon/trmrk-app-icon';

import { encodeHtml } from '../../trmrk/text';

@Component({
  selector: 'app-home-page',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatIconButton,
    RouterLink,
    TrmrkAppIcon,
    MatMenuModule,
    CommonModule,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  nonBreakingText = encodeHtml(
    'This is a    non-breaking &space example.<h5>asdfasdfasdf</h5>',
    true
  );

  @ViewChild(MatMenu) optionsMenu!: MatMenu;

  @ViewChild('optionsMenuTrigger', { read: MatMenuTrigger })
  optionsMenuTrigger!: MatMenuTrigger;

  constructor() {
    setTimeout(() => {
      this.optionsMenuTrigger.menu = this.optionsMenu;
    }, 0);
  }

  onOptionsMenuBtnClick(event: MouseEvent): void {
    this.optionsMenuTrigger.openMenu();
  }
}
