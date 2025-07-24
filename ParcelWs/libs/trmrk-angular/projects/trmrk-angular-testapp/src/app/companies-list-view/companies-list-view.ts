import { Component, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { TouchOrMouseCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';

import { companies } from '../services/companies';

import { TrmrkPanelListItem } from 'trmrk-angular';

import { TrmrkListView } from '../trmrk-list-view/trmrk-list-view';

import {
  TrmrkPanelListService,
  TrmrkPanelListServiceRow,
} from '../services/trmrkPanelListService';

@Component({
  selector: 'app-companies-list-view',
  imports: [CommonModule, TrmrkListView, TrmrkPanelListItem],
  templateUrl: './companies-list-view.html',
  styleUrl: './companies-list-view.scss',
})
export class CompaniesListView {
  @ViewChildren('companyListItems')
  listItems!: QueryList<TrmrkPanelListItem>;

  getListItems = () => this.listItems;

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
