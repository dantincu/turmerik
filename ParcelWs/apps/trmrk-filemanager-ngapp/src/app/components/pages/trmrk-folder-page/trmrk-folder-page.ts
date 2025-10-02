import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';

import { AppServiceBase } from '../../../../trmrk-angular/services/common/app-service-base';
import { TrmrkAppPage } from '../../../../trmrk-angular/components/common/trmrk-app-page/trmrk-app-page';

import { TrmrkFolderView } from '../../../../trmrk-filemanager-nglib/components/common/trmrk-folder-view/trmrk-folder-view';
import { AppService } from '../../../services/app-service';

@Component({
  selector: 'trmrk-folder-page',
  imports: [CommonModule, MatIconModule, MatMenuModule, TrmrkAppPage, TrmrkFolderView],
  templateUrl: './trmrk-folder-page.html',
  styleUrl: './trmrk-folder-page.scss',
})
export class TrmrkFolderPage {
  constructor(@Inject(AppServiceBase) private appService: AppService) {}
}
