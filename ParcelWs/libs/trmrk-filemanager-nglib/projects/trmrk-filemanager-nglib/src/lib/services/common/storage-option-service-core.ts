import { Injectable, Inject, OnDestroy } from '@angular/core';

import {
  SharedBasicAppSettingsDbAdapter,
  SharedAppSettingsChoice,
} from '../../../trmrk-browser/indexedDB/databases/SharedBasicAppSettings';

import { injectionTokens } from '../../../trmrk-angular/services/dependency-injection';
import { dbRequestToPromise } from '../../../trmrk-browser/indexedDB/core';
import { getAppObjectKey } from '../../../trmrk-angular/services/common/app-service-base';
import { AppStateServiceBase } from '../../../trmrk-angular/services/common/app-state-service-base';
import { TrmrkObservable } from '../../../trmrk-angular/services/common/TrmrkObservable';

import { IndexedDbDatabasesServiceCore } from '../../../trmrk-angular/services/common/indexedDb/indexed-db-databases-service-core';
import { appSettingsChoiceKeys } from './indexedDb/core';
import { AppDriveStorageOption } from './driveStorageOption';

@Injectable({
  providedIn: 'root',
})
export class StorageOptionServiceCore implements OnDestroy {
  public currentStorageOption = new TrmrkObservable<AppDriveStorageOption | null>(null);

  private basicAppSettingsDbAdapter: SharedBasicAppSettingsDbAdapter;

  private choiceCatKey: string;
  private choiceKey: string;
  private keyPath: string[];

  constructor(
    private indexedDbDatabasesService: IndexedDbDatabasesServiceCore,
    private appStateService: AppStateServiceBase,
    @Inject(injectionTokens.appName.token) private appName: string
  ) {
    this.basicAppSettingsDbAdapter = indexedDbDatabasesService.sharedBasicAppSettings.value;
    this.choiceCatKey = getAppObjectKey([appSettingsChoiceKeys.driveStorageOption]);
    this.choiceKey = getAppObjectKey([appSettingsChoiceKeys.current]);
    this.keyPath = [this.choiceCatKey, this.choiceKey];
  }

  ngOnDestroy(): void {
    this.currentStorageOption.dispose();
  }

  updateCurrentStorageOption(storageOption: AppDriveStorageOption) {
    this.currentStorageOption.next(storageOption);
    this.writeCurrentToIndexedDb();
  }

  loadCurrentFromIndexedDb() {
    return new Promise<AppDriveStorageOption | null>((resolve, reject) => {
      this.basicAppSettingsDbAdapter.open(
        (_, db) => {
          dbRequestToPromise<SharedAppSettingsChoice<AppDriveStorageOption>>(
            this.basicAppSettingsDbAdapter.stores.choices.store(db).get(this.keyPath)
          ).then((dbResponse) => {
            const choice = dbResponse.value;

            if (choice) {
              this.currentStorageOption.next(choice.value);
              this.appStateService.hasBeenSetUp.next(true, true);
              resolve(choice.value);
            } else {
              resolve(null);
            }
          }, reject);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  }

  writeCurrentToIndexedDb() {
    return new Promise<void>((resolve, reject) => {
      this.basicAppSettingsDbAdapter.open(
        (_, db) => {
          if (this.currentStorageOption) {
            dbRequestToPromise(
              this.basicAppSettingsDbAdapter.stores.choices.store(db, null, 'readwrite').put({
                catKey: this.choiceCatKey,
                key: this.choiceKey,
                value: this.currentStorageOption.value,
              } as SharedAppSettingsChoice)
            ).then(() => resolve(), reject);
          } else {
            reject(new Error('No storage option has been choosen'));
          }
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  }
}
