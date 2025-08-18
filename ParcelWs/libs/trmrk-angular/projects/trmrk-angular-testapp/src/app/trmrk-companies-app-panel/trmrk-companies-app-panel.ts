import {
  Component,
  ViewChildren,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';

import { TrmrkPanelListItem, TrmrkTouchStartOrMouseDown } from 'trmrk-angular';

import { companies } from '../services/companies';
import { TouchOrMouseCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';

import { TrmrkListAppPanel } from '../trmrk-list-app-panel/trmrk-list-app-panel';

import {
  TrmrkPanelListService,
  TrmrkPanelListServiceRow,
} from '../services/trmrk-panel-list-service';

@Component({
  selector: 'trmrk-companies-app-panel',
  imports: [
    CommonModule,
    TrmrkPanelListItem,
    TrmrkTouchStartOrMouseDown,
    MatIconModule,
    MatMenuModule,
    TrmrkListAppPanel,
  ],
  templateUrl: './trmrk-companies-app-panel.html',
  styleUrl: './trmrk-companies-app-panel.scss',
  providers: [TrmrkPanelListService],
  encapsulation: ViewEncapsulation.None,
})
export class TrmrkCompaniesAppPanel {
  @ViewChildren('listItems')
  listItems!: QueryList<TrmrkPanelListItem>;

  @ViewChildren('currentlyMovingListItems')
  currentlyMovingListItems!: QueryList<TrmrkPanelListItem>;

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

  constructor(public panelListService: TrmrkPanelListService<any, any>) {}

  rowsUpdated(rows: TrmrkPanelListServiceRow<any>[]) {
    this.rows = rows;
  }

  rowsMasterCheckBoxToggled(event: MatCheckboxChange) {
    this.panelListService.rowsMasterCheckBoxToggled(event);
  }

  rowIconShortPressOrLeftClick(event: TouchOrMouseCoords, idx: number) {}

  rowTextShortPressOrLeftClick(event: TouchOrMouseCoords, idx: number) {}
}
