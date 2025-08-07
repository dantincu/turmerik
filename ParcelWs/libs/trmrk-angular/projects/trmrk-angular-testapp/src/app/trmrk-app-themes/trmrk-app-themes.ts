import { Component, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { TrmrkPanelListItem, TrmrkTouchStartOrMouseDown } from 'trmrk-angular';

import { TouchOrMouseCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';

import { TrmrkListAppPanel } from '../trmrk-list-app-panel/trmrk-list-app-panel';

import {
  TrmrkPanelListService,
  TrmrkPanelListServiceRow,
} from '../services/trmrk-panel-list-service';

import { TrmrkAppPage } from 'trmrk-angular';

@Component({
  selector: 'trmrk-app-themes',
  imports: [
    TrmrkAppPage,
    MatIconModule,
    MatButtonModule,
    TrmrkListAppPanel,
    TrmrkPanelListItem,
    CommonModule,
    TrmrkTouchStartOrMouseDown,
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

  entities: any[] = [];
  isLoading = false;
  hasLoaded = false;

  rows: TrmrkPanelListServiceRow<{
    id: number;
    name: string;
  }>[] = [];

  constructor(public panelListService: TrmrkPanelListService<any, any>) {}

  rowsUpdated(rows: TrmrkPanelListServiceRow<any>[]) {
    this.rows = rows;
  }

  rowIconShortPressOrLeftClick(event: TouchOrMouseCoords, idx: number) {}

  rowTextShortPressOrLeftClick(event: TouchOrMouseCoords, idx: number) {}
}
