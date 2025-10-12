import { Injectable, Inject, OnDestroy } from '@angular/core';

import {
  SharedBasicAppSettingsDbAdapter,
  SharedAppSettingsChoice,
  AppSettingsChoice,
} from '../../../trmrk-browser/indexedDB/databases/SharedBasicAppSettings';

import { BasicAppSettingsDbAdapter } from '../../../trmrk-browser/indexedDB/databases/BasicAppSettings';

import { NullOrUndef } from '../../../trmrk/core';
import { injectionTokens } from '../../../trmrk-angular/services/dependency-injection';
import { dbRequestToPromise } from '../../../trmrk-browser/indexedDB/core';
import { getAppObjectKey } from '../../../trmrk-angular/services/common/app-service-base';
import { AppStateServiceBase } from '../../../trmrk-angular/services/common/app-state-service-base';
import { TrmrkObservable } from '../../../trmrk-angular/services/common/TrmrkObservable';

import { IndexedDbDatabasesServiceCore } from '../../../trmrk-angular/services/common/indexedDb/indexed-db-databases-service-core';
import { appSettingsChoiceKeys } from './indexedDb/core';
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

  private sharedBasicAppSettingsDbAdapter: SharedBasicAppSettingsDbAdapter;
  private basicAppSettingsDbAdapter: BasicAppSettingsDbAdapter;

  private choiceCatKey: string;
  private choiceKey: string;
  private keyPath: string[];

  constructor(
    private indexedDbDatabasesService: IndexedDbDatabasesServiceCore,
    private appStateService: AppStateServiceBase,
    @Inject(injectionTokens.appName.token) private appName: string
  ) {
    this.sharedBasicAppSettingsDbAdapter = indexedDbDatabasesService.sharedBasicAppSettings.value;
    this.basicAppSettingsDbAdapter = indexedDbDatabasesService.basicAppSettings.value;
    this.choiceCatKey = getAppObjectKey([appSettingsChoiceKeys.driveStorageOption]);
    this.choiceKey = getAppObjectKey([appSettingsChoiceKeys.current]);
    this.keyPath = [this.choiceCatKey, this.choiceKey];
  }

  ngOnDestroy(): void {
    this.currentStorageOption.dispose();
  }

  updateCurrentStorageOption(
    storageOption: AppDriveStorageOption,
    sessionId?: string | NullOrUndef
  ) {
    this.currentStorageOption.next(storageOption);
    this.writeCurrentToIndexedDb(sessionId);
  }

  loadCurrentFromIndexedDb(sessionId?: string | NullOrUndef) {
    return new Promise<StorageOptionWrapperSrlzbl | null>((resolve, reject) => {
      const basicAppSettingsDbAdapter = this.getBasicAppSettingsDbAdapter(sessionId);

      basicAppSettingsDbAdapter.open(
        (_, db) => {
          dbRequestToPromise<
            | SharedAppSettingsChoice<StorageOptionWrapperSrlzbl>
            | AppSettingsChoice<StorageOptionWrapperSrlzbl>
          >(
            basicAppSettingsDbAdapter.stores.choices.store(db).get(this.getKeyPath(sessionId))
          ).then((dbResponse) => {
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
          }, reject);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  }

  writeCurrentToIndexedDb(sessionId?: string | NullOrUndef) {
    return new Promise<void>((resolve, reject) => {
      const basicAppSettingsDbAdapter = this.getBasicAppSettingsDbAdapter(sessionId);

      basicAppSettingsDbAdapter.open(
        (_, db) => {
          if (this.currentStorageOption) {
            dbRequestToPromise(
              basicAppSettingsDbAdapter.stores.choices
                .store(db, null, 'readwrite')
                .put(this.getAppSettingsChoiceToWrite(sessionId))
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

  getKeyPath(sessionId: string | NullOrUndef) {
    const keyPath = (sessionId ?? null) !== null ? [...this.keyPath, sessionId!] : this.keyPath;
    return keyPath;
  }

  getBasicAppSettingsDbAdapter(sessionId: string | NullOrUndef) {
    const basicAppSettingsDbAdapter =
      (sessionId ?? null) !== null
        ? this.basicAppSettingsDbAdapter
        : this.sharedBasicAppSettingsDbAdapter;

    return basicAppSettingsDbAdapter;
  }

  getAppSettingsChoiceToWrite(
    sessionId: string | NullOrUndef
  ): AppSettingsChoice | SharedAppSettingsChoice {
    const appSettingsChoice = {
      catKey: this.choiceCatKey,
      key: this.choiceKey,
      value: {
        option: this.currentStorageOption.value,
        userIdnf: this.currentUserIdnf.value,
      },
    } as AppSettingsChoice<StorageOptionWrapperSrlzbl>;

    if ((sessionId ?? null) !== null) {
      appSettingsChoice.sessionId = sessionId!;
    }

    return appSettingsChoice;
  }
}
