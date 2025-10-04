import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';

import { AppServiceBase } from '../../../../trmrk-angular/services/common/app-service-base';

import {
  TrmrkPaginatedListService,
  TrmrkPaginatedListServiceSetupArgs,
} from '../../../../trmrk-angular/services/common/trmrk-paginated-list-service';

import { IntIdMappedAppPanelLayoutServiceFactory } from '../../../../trmrk-angular/services/common/int-id-mapped-app-panel-layout-service-factory';
import { AppPanelLayoutService } from '../../../../trmrk-angular/services/common/app-panel-layout-service';

import { TrmrkPaginatedList } from '../../../../trmrk-angular/components/common/trmrk-paginated-list/trmrk-paginated-list';
import { Trmrk3PanelsLayout } from '../../../../trmrk-angular/components/common/trmrk-3-panels-layout/trmrk-3-panels-layout';

@Component({
  selector: 'trmrk-folder-view',
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    /* TrmrkPaginatedList, */ Trmrk3PanelsLayout,
  ],
  templateUrl: './trmrk-folder-view.html',
  providers: [TrmrkPaginatedListService],
  styleUrl: './trmrk-folder-view.scss',
})
export class TrmrkFolderView {
  layoutId = 0;
  private layoutService!: AppPanelLayoutService;

  constructor(
    public trmrkPaginatedListService: TrmrkPaginatedListService,
    private intIdMappedAppPanelLayoutServiceFactory: IntIdMappedAppPanelLayoutServiceFactory
  ) {
    setTimeout(() => {
      this.layoutId = this.trmrk3PanelsLayout.id;
      this.layoutService = intIdMappedAppPanelLayoutServiceFactory.getOrCreate(this.layoutId);

      this.layoutService.onAfterSetup.subscribe(() => {
        this.layoutService.allowToggleLeftPanel = true;
        this.layoutService.showLeftPanel = true;
        this.layoutService.showLeftPanelOptionsBtn = true;
        this.layoutService.allowToggleMiddlePanel = true;
        this.layoutService.showMiddlePanel = true;
        this.layoutService.showMiddlePanelOptionsBtn = true;
        this.layoutService.allowToggleRightPanel = true;
        this.layoutService.showRightPanel = true;
        this.layoutService.showRightPanelOptionsBtn = true;
      });
    });
  }

  @ViewChild('trmrk3PanelsLayout', { read: Trmrk3PanelsLayout })
  trmrk3PanelsLayout!: Trmrk3PanelsLayout;
}
