import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';

import { AppServiceBase } from '../../../../trmrk-angular/services/common/app-service-base';

import {
  TrmrkPaginatedListService,
  TrmrkPaginatedListServiceSetupArgs,
} from '../../../../trmrk-angular/services/common/trmrk-paginated-list-service';

import { TrmrkPaginatedList } from '../../../../trmrk-angular/components/common/trmrk-paginated-list/trmrk-paginated-list';
import { Trmrk3PanelsLayout } from '../../../../trmrk-angular/components/common/trmrk-3-panels-layout/trmrk-3-panels-layout';

import { AppService } from '../../../services/app-service';

@Component({
  selector: 'trmrk-folder-view',
  imports: [CommonModule, MatIconModule, MatMenuModule, TrmrkPaginatedList, Trmrk3PanelsLayout],
  templateUrl: './trmrk-folder-view.html',
  providers: [TrmrkPaginatedListService],
  styleUrl: './trmrk-folder-view.scss',
})
export class TrmrkFolderView {
  constructor(public trmrkPaginatedListService: TrmrkPaginatedListService) {}
}
