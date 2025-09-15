import { Injectable, InjectionToken, Inject } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { BasicAppSettingsDbAdapter } from '../../../trmrk-browser/indexedDB/databases/BasicAppSettings';

import {
  AsyncRequestStateManager,
  AsyncRequestStateManagerFactory,
} from '../../../trmrk/AsyncRequestStateManager';

import { getIDbRequestOpenErrorMsg } from '../../../trmrk-browser/indexedDB/core';
import { TouchOrMouseCoords } from '../../../trmrk-browser/domUtils/touchAndMouseEvents';
import { AppTheme } from '../../../trmrk-browser/indexedDB/databases/BasicAppSettings';

import { TrmrkPanelListServiceRow } from '../../services/trmrk-panel-list-service';
import { openDialog, DialogPanelSize } from '../../services/trmrk-dialog';

export const BASIC_APP_SETTINGS_DB_ADAPTER = new InjectionToken<object>(
  'BasicAppSettingsDbAdapter'
);

export interface TrmrkAppThemesServiceInitArgs {
  trmrkEditAppThemeDialogComponent: any;
  editEntityDialog: MatDialog;
}

@Injectable({
  providedIn: 'root',
})
export class TrmrkAppThemesService {
  reqStateManager: AsyncRequestStateManager<DOMException | null>;

  entities: AppTheme[] = [];

  rows: TrmrkPanelListServiceRow<{
    id: number;
    name: string;
  }>[] = [];

  trmrkEditAppThemeDialogComponent: any;
  editEntityDialog!: MatDialog;

  constructor(
    @Inject(BASIC_APP_SETTINGS_DB_ADAPTER) public trmrkBasicAppSettings: BasicAppSettingsDbAdapter,
    asyncRequestStateManagerFactory: AsyncRequestStateManagerFactory
  ) {
    this.reqStateManager = asyncRequestStateManagerFactory.create<DOMException | null>(
      null,
      (error) => ['Error opening IndexedDB', getIDbRequestOpenErrorMsg(error)]
    );
  }

  init(args: TrmrkAppThemesServiceInitArgs) {
    this.trmrkEditAppThemeDialogComponent = args.trmrkEditAppThemeDialogComponent;
    this.editEntityDialog = args.editEntityDialog;

    setTimeout(() => {
      this.reqStateManager.beforeSend();

      this.trmrkBasicAppSettings.open(
        (_, db) => {
          const req = this.trmrkBasicAppSettings.stores.appThemes.store(db).getAll();

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
      dialogComponent: this.trmrkEditAppThemeDialogComponent,
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
