import { Injectable, Inject, OnDestroy } from '@angular/core';

import {
  BasicAppSettingsDbAdapter,
  AppSettingsChoice,
  AppSessionSettingsChoice,
  AppSessionTabSettingsChoice,
} from '../../../trmrk-browser/indexedDB/databases/BasicAppSettings';

import { NullOrUndef } from '../../../trmrk/core';
import { injectionTokens } from '../../../trmrk-angular/services/dependency-injection';
import { dbRequestToPromise } from '../../../trmrk-browser/indexedDB/core';
import { getAppObjectKey } from '../../../trmrk-angular/services/common/app-service-base';
import { AppStateServiceBase } from '../../../trmrk-angular/services/common/app-state-service-base';
import { TrmrkObservable } from '../../../trmrk-angular/services/common/TrmrkObservable';

import { IndexedDbDatabasesServiceCore } from '../../../trmrk-angular/services/common/indexedDb/indexed-db-databases-service-core';
import { appSettingsChoiceKeys } from './indexedDb/files';
import { AppDriveStorageOption, StorageUserIdnf } from './driveStorageOption';

export interface StorageOptionWrapperSrlzbl {
  option: AppDriveStorageOption;
  userIdnf: StorageUserIdnf;
}

@Injectable({
  providedIn: 'root',
})
export class StorageOptionServiceCore implements OnDestroy {
  public currentStorageOption = new TrmrkObservable<AppDriveStorageOption | null>(null);
  public currentUserIdnf = new TrmrkObservable<StorageUserIdnf | null>(null);

  private basicAppSettingsDbAdapter: BasicAppSettingsDbAdapter;

  private choiceCatKey: string;
  private choiceKey: string;
  private keyPath: string[];

  constructor(
    private indexedDbDatabasesService: IndexedDbDatabasesServiceCore,
    private appStateService: AppStateServiceBase,
    @Inject(injectionTokens.appName.token) private appName: string
  ) {
    this.basicAppSettingsDbAdapter = indexedDbDatabasesService.basicAppSettings.value;
    this.choiceCatKey = getAppObjectKey([appSettingsChoiceKeys.driveStorageOption]);
    this.choiceKey = getAppObjectKey([appSettingsChoiceKeys.current]);
    this.keyPath = [this.choiceCatKey, this.choiceKey];
  }

  ngOnDestroy(): void {
    this.currentStorageOption.dispose();
  }

  updateCurrentStorageOption(storageOption: AppDriveStorageOption, tabId: string) {
    this.currentStorageOption.next(storageOption);
    return this.writeCurrentToIndexedDb(tabId);
  }

  loadCurrentFromIndexedDb(tabId: string) {
    return new Promise<StorageOptionWrapperSrlzbl | null>((resolve, reject) => {
      const basicAppSettingsDbAdapter = this.basicAppSettingsDbAdapter;

      basicAppSettingsDbAdapter.open(
        (_, db) => {
          dbRequestToPromise<
            | AppSettingsChoice<StorageOptionWrapperSrlzbl>
            | AppSessionSettingsChoice<StorageOptionWrapperSrlzbl>
          >(basicAppSettingsDbAdapter.stores.tabChoices.store(db).get(this.getKeyPath(tabId))).then(
            (dbResponse) => {
              const choice = dbResponse.value;

              if (choice) {
                this.currentStorageOption.next(choice.value.option);

                this.currentUserIdnf.next(
                  choice.value.userIdnf,
                  true,
                  (prev, next) => (prev ?? null) !== (next ?? null)
                );

                this.appStateService.hasBeenSetUp.next(true, true);
                resolve(choice.value);
              } else {
                resolve(null);
              }
            },
            reject
          );
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  }

  writeCurrentToIndexedDb(tabId: string) {
    return new Promise<void>((resolve, reject) => {
      const basicAppSettingsDbAdapter = this.basicAppSettingsDbAdapter;

      basicAppSettingsDbAdapter.open(
        (_, db) => {
          if (this.currentStorageOption) {
            dbRequestToPromise(
              basicAppSettingsDbAdapter.stores.tabChoices
                .store(db, null, 'readwrite')
                .put(this.getAppSettingsChoiceToWrite(tabId))
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

  getKeyPath(tabId: string) {
    const keyPath = [...this.keyPath, tabId];
    return keyPath;
  }

  getAppSettingsChoiceToWrite(tabId: string): AppSessionSettingsChoice | AppSettingsChoice {
    const appSettingsChoice = {
      catKey: this.choiceCatKey,
      key: this.choiceKey,
      tabId,
      value: {
        option: this.currentStorageOption.value,
        userIdnf: this.currentUserIdnf.value,
      },
    } as AppSessionTabSettingsChoice<StorageOptionWrapperSrlzbl>;

    return appSettingsChoice;
  }
}
