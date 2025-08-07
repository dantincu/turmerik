import { Component, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { TrmrkPanelListItem, TrmrkTouchStartOrMouseDown } from 'trmrk-angular';

import { TouchOrMouseCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';
import { iDbAdapters } from '../../trmrk-browser/indexedDB/databases/adapters';
import { getIDbRequestOpenErrorMsg } from '../../trmrk-browser/indexedDB/core';
import { AppTheme } from '../../trmrk-browser/indexedDB/databases/BasicAppSettings';

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
  hasLoadReqFinished = false;
  hasError = false;
  errorTitle = '';
  errorMsg = '';

  rows: TrmrkPanelListServiceRow<{
    id: number;
    name: string;
  }>[] = [];

  constructor(public panelListService: TrmrkPanelListService<any, any>) {}

  ngAfterViewInit() {
    if (!this.hasLoadReqFinished) {
      setTimeout(() => {
        this.isLoading = true;
        const adapter = iDbAdapters.basicAppSettings;

        adapter.open(
          (_, db) => {
            const req = adapter.stores.appThemes.store(db).getAll();

            req.onsuccess = (event) => {
              const target = event.target as IDBRequest<AppTheme[]>;
              this.isLoading = false;
              this.hasLoadReqFinished = true;
              this.entities = target.result;
            };

            req.onerror = (event) => {
              const target = event.target as IDBRequest;
              this.isLoading = false;
              this.hasLoadReqFinished = true;
              this.hasError = true;
              this.errorMsg = getIDbRequestOpenErrorMsg(target.error);
            };
          },
          (_, error) => {
            this.isLoading = false;
            this.hasLoadReqFinished = true;
            this.errorTitle = 'Error opening IndexedDB';
            this.errorMsg = getIDbRequestOpenErrorMsg(error);
            this.hasError = true;
          }
        );
      });
    }
  }

  rowsUpdated(rows: TrmrkPanelListServiceRow<any>[]) {
    this.rows = rows;
  }

  rowIconShortPressOrLeftClick(event: TouchOrMouseCoords, idx: number) {}

  rowTextShortPressOrLeftClick(event: TouchOrMouseCoords, idx: number) {}
}
