import { Component, ViewChildren, QueryList, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { TrmrkTouchStartOrMouseDown } from '../../../directives/trmrk-touch-start-or-mouse-down';

import { TrmrkPanelListItem } from '../../common/trmrk-panel-list-item/trmrk-panel-list-item';

import { TrmrkListAppPanel } from '../../common/trmrk-list-app-panel/trmrk-list-app-panel';
import { TrmrkEditAppThemeDialog } from './trmrk-edit-app-theme/trmrk-edit-app-theme-dialog';

import {
  TrmrkPanelListService,
  TrmrkPanelListServiceRow,
} from '../../../services/trmrk-panel-list-service';

import { TrmrkAppThemesService } from '../../../services/pages/trmrk-app-themes-service';

import { TrmrkAppPage } from '../../common/trmrk-app-page/trmrk-app-page';

@Component({
  selector: 'trmrk-app-themes',
  standalone: true,
  imports: [
    TrmrkAppPage,
    MatIconModule,
    MatButtonModule,
    TrmrkListAppPanel,
    TrmrkPanelListItem,
    CommonModule,
    TrmrkTouchStartOrMouseDown,
    MatDialogModule,
    TrmrkEditAppThemeDialog,
  ],
  templateUrl: './trmrk-app-themes.html',
  styleUrl: './trmrk-app-themes.scss',
  providers: [TrmrkPanelListService],
})
export class TrmrkAppThemes {
  @ViewChildren('listItems')
  listItems!: QueryList<TrmrkPanelListItem>;

  @ViewChildren('currentlyMovingListItems')
  currentlyMovingListItems!: QueryList<TrmrkPanelListItem>;

  getListItems = () => this.listItems;
  getCurrentlyMovingListItems = () => this.currentlyMovingListItems;

  constructor(
    public panelListService: TrmrkPanelListService<any, any>,
    public trmrkAppThemesService: TrmrkAppThemesService,
    private editEntityDialog: MatDialog
  ) {}

  ngAfterViewInit() {
    this.trmrkAppThemesService.init({
      trmrkEditAppThemeDialogComponent: TrmrkEditAppThemeDialog,
      editEntityDialog: this.editEntityDialog,
    });
  }
}
