import { Injectable, Inject, OnDestroy } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { SharedBasicAppSettingsDbAdapter } from '../../../trmrk-browser/indexedDB/databases/SharedBasicAppSettings';

import {
  AsyncRequestStateManager,
  AsyncRequestStateManagerFactory,
} from '../../../trmrk/AsyncRequestStateManager1';

import { getIDbRequestOpenErrorMsg } from '../../../trmrk-browser/indexedDB/core';
import { TouchOrMouseCoords } from '../../../trmrk-browser/domUtils/touchAndMouseEvents';
import { AppTheme } from '../../../trmrk-browser/indexedDB/databases/SharedBasicAppSettings';

import { TrmrkPanelListServiceRow } from '../common/trmrk-panel-list-service';
import { IndexedDbDatabasesServiceCore } from '../common/indexedDb/indexed-db-databases-service-core';

import {
  openDialog,
  DialogPanelSize,
  TrmrkDialogComponentDataCore,
} from '../../services/common/trmrk-dialog';

import { injectionTokens } from '../dependency-injection/injection-tokens';

export interface TrmrkEditAppThemeDialogComponentData extends TrmrkDialogComponentDataCore {
  name: string;
}

export interface TrmrkAppThemesServiceInitArgs {
  trmrkEditAppThemeDialogComponent: any;
  editEntityDialog: MatDialog;
}

@Injectable({
  providedIn: 'root',
})
export class TrmrkAppThemesService implements OnDestroy {
  reqStateManager: AsyncRequestStateManager<DOMException | null>;

  entities: AppTheme[] = [];

  rows: TrmrkPanelListServiceRow<{
    id: number;
    name: string;
  }>[] = [];

  trmrkEditAppThemeDialogComponent: any;
  editEntityDialog!: MatDialog;
  trmrkBasicAppSettings: SharedBasicAppSettingsDbAdapter;

  constructor(
    asyncRequestStateManagerFactory: AsyncRequestStateManagerFactory,
    private indexedDbDatabasesService: IndexedDbDatabasesServiceCore
  ) {
    this.trmrkBasicAppSettings = indexedDbDatabasesService.sharedBasicAppSettings.value;
    this.reqStateManager = asyncRequestStateManagerFactory.create<DOMException | null>(
      null,
      (error) => ['Error opening IndexedDB', getIDbRequestOpenErrorMsg(error)]
    );
  }

  ngOnDestroy(): void {
    this.reqStateManager = null!;
    this.rows = null!;
    this.trmrkEditAppThemeDialogComponent = null!;
    this.editEntityDialog = null!;
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
    openDialog<TrmrkEditAppThemeDialogComponentData>({
      matDialog: this.editEntityDialog,
      dialogComponent: this.trmrkEditAppThemeDialogComponent,
      data: {
        title: 'Add app theme',
        data: {
          name: '',
        },
      },
      clickEvent: event,
      dialogPanelSize: DialogPanelSize.Large,
    });
  }
}
