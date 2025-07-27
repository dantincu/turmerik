import { Component, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrmrkPanelListItem } from 'trmrk-angular';

import { companies } from '../services/companies';
import { TrmrkListView } from '../trmrk-list-view/trmrk-list-view';
import { TrmrkTouchStartOrMouseDown } from '../directives/trmrk-touch-start-or-mouse-down';

import {
  TrmrkPanelListService,
  TrmrkPanelListServiceRow,
} from '../services/trmrk-panel-list-service';

@Component({
  selector: 'app-companies-list-view',
  imports: [
    CommonModule,
    TrmrkListView,
    TrmrkPanelListItem,
    TrmrkTouchStartOrMouseDown,
  ],
  templateUrl: './companies-list-view.html',
  styleUrl: './companies-list-view.scss',
})
export class CompaniesListView {
  @ViewChildren('listItems')
  listItems!: QueryList<TrmrkPanelListItem>;

  @ViewChildren('currentlyMovingListItems')
  currentlyMovingListItems!: QueryList<TrmrkPanelListItem>;

  listItemsColl!: QueryList<TrmrkPanelListItem>;
  currentlyMovingListItemsColl!: QueryList<TrmrkPanelListItem>;

  getListItems = () => this.listItems;
  getCurrentlyMovingListItems = () => this.currentlyMovingListItems;

  entities = companies.slice(0, 200).map((name, idx) => ({
    id: idx + 1,
    name,
  }));

  rows: TrmrkPanelListServiceRow<{
    id: number;
    name: string;
  }>[] = [];

  panelListService!: TrmrkPanelListService<any, TrmrkPanelListItem>;

  rowsUpdated(rows: TrmrkPanelListServiceRow<any>[]) {
    this.rows = rows;
  }

  onPanelListService(
    panelListService: TrmrkPanelListService<any, TrmrkPanelListItem>
  ) {
    this.panelListService = panelListService;
  }
}
