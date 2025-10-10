import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';

import { AppServiceBase } from '../../../../trmrk-angular/services/common/app-service-base';
import { TrmrkAppPage } from '../../../../trmrk-angular/components/common/trmrk-app-page/trmrk-app-page';

import { TrmrkFolderView } from '../../../../trmrk-filemanager-nglib/components/common/trmrk-folder-view/trmrk-folder-view';
import { TrmrkFolderViewService } from '../../../../trmrk-filemanager-nglib/components/common/trmrk-folder-view/trmrk-folder-view-service';

import { AppService } from '../../../services/common/app-service';

@Component({
  selector: 'trmrk-folder-page',
  imports: [CommonModule, MatIconModule, MatMenuModule, TrmrkAppPage, TrmrkFolderView],
  templateUrl: './trmrk-folder-page.html',
  styleUrl: './trmrk-folder-page.scss',
  providers: [TrmrkFolderViewService],
})
export class TrmrkFolderPage {
  constructor(
    public folderViewService: TrmrkFolderViewService,
    @Inject(AppServiceBase) private appService: AppService
  ) {}
}
