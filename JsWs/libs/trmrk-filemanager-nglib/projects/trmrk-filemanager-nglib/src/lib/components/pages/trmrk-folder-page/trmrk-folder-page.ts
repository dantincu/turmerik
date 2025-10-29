import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { TrmrkAppPage } from '../../../../trmrk-angular/components/common/trmrk-app-page/trmrk-app-page';

import { TrmrkFolderView } from '../../common/trmrk-folder-view/trmrk-folder-view';

@Component({
  selector: 'trmrk-folder-page',
  imports: [CommonModule, MatIconModule, MatMenuModule, TrmrkAppPage, TrmrkFolderView],
  templateUrl: './trmrk-folder-page.html',
  styleUrl: './trmrk-folder-page.scss',
  providers: [],
})
export class TrmrkFolderPage {
  constructor() {}
}
