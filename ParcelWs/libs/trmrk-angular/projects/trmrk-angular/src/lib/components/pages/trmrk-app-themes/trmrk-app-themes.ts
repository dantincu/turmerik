import { Component, ViewChildren, QueryList, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { TrmrkTouchStartOrMouseDown } from '../../../directives/trmrk-touch-start-or-mouse-down';

import { TrmrkPanelListItem } from '../../common/trmrk-panel-list-item/trmrk-panel-list-item';

import { AsyncRequestStateManager } from '../../../../trmrk/AsyncRequestStateManager';
import { TouchOrMouseCoords } from '../../../../trmrk-browser/domUtils/touchAndMouseEvents';

import { BasicAppSettingsDbAdapter } from '../../../../trmrk-browser/indexedDB/databases/BasicAppSettings';

import { getIDbRequestOpenErrorMsg } from '../../../../trmrk-browser/indexedDB/core';
import { AppTheme } from '../../../../trmrk-browser/indexedDB/databases/BasicAppSettings';

import { TrmrkListAppPanel } from '../../common/trmrk-list-app-panel/trmrk-list-app-panel';
import { TrmrkEditAppThemeDialog } from './trmrk-edit-app-theme/trmrk-edit-app-theme-dialog';

import {
  TrmrkPanelListService,
  TrmrkPanelListServiceRow,
} from '../../../services/trmrk-panel-list-service';

import { openDialog, DialogPanelSize } from '../../../services/trmrk-dialog';

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
  @Input() trmrkBasicAppSettings!: BasicAppSettingsDbAdapter;

  @ViewChildren('listItems')
  listItems!: QueryList<TrmrkPanelListItem>;

  @ViewChildren('currentlyMovingListItems')
  currentlyMovingListItems!: QueryList<TrmrkPanelListItem>;

  getListItems = () => this.listItems;
  getCurrentlyMovingListItems = () => this.currentlyMovingListItems;

  entities: AppTheme[] = [];

  reqStateManager = new AsyncRequestStateManager<DOMException | null>(
    null,
    (error) => ['Error opening IndexedDB', getIDbRequestOpenErrorMsg(error)]
  );

  rows: TrmrkPanelListServiceRow<{
    id: number;
    name: string;
  }>[] = [];

  constructor(
    public panelListService: TrmrkPanelListService<any, any>,
    private editEntityDialog: MatDialog
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.reqStateManager.beforeSend();

      this.trmrkBasicAppSettings.open(
        (_, db) => {
          const req = this.trmrkBasicAppSettings.stores.appThemes
            .store(db)
            .getAll();

          req.onsuccess = (event) => {
            const target = event.target as IDBRequest<AppTheme[]>;
            this.reqStateManager.success();
            this.entities = target.result;
          };

          req.onerror = (event) => {
            const target = event.target as IDBRequest;
            this.reqStateManager.error(target.error);
          };
        },
        (_, error) => {
          this.reqStateManager.error(error);
        }
      );
    });
  }

  rowsUpdated(rows: TrmrkPanelListServiceRow<any>[]) {
    this.rows = rows;
  }

  rowIconShortPressOrLeftClick(event: TouchOrMouseCoords, idx: number) {}

  rowTextShortPressOrLeftClick(event: TouchOrMouseCoords, idx: number) {}

  addEntityClick(event: MouseEvent) {
    openDialog({
      matDialog: this.editEntityDialog,
      dialogComponent: TrmrkEditAppThemeDialog,
      data: {
        title: 'Add app theme',
        disableClose: false,
        data: {
          name: '',
        },
      },
      clickEvent: event,
      dialogPanelSize: DialogPanelSize.Large,
    });
  }
}
