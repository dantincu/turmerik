import { Injectable, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import {
  BasicAppSettingsDbAdapter,
  AppSettingsChoice,
} from '../../../trmrk-browser/indexedDB/databases/BasicAppSettings';

import { DriveStorageOption } from '../../../trmrk/driveStorage/appConfig';
import { injectionTokens } from '../../../trmrk-angular/services/dependency-injection';
import { dbRequestToPromise } from '../../../trmrk-browser/indexedDB/core';
import { getAppObjectKey } from '../../../trmrk-angular/services/common/app-service-base';
import { TrmrkObservable } from '../../../trmrk-angular/services/common/TrmrkObservable';

import { IndexedDbDatabasesService } from './indexedDb/indexed-db-databases-service';
import { AppConfig } from './app-config';
import { appSettingsChoiceKeys } from './indexedDb/core';
import { AppDriveStorageOption } from './driveStorageOption';

@Injectable({
  providedIn: 'root',
})
export class StorageOptionService implements OnDestroy {
  public currentStorageOption =
    new TrmrkObservable<AppDriveStorageOption<FileSystemDirectoryHandle> | null>(null);

  private basicAppSettingsDbAdapter: BasicAppSettingsDbAdapter;

  private choiceCatKey: string;
  private choiceKey: string;
  private keyPath: string[];

  constructor(
    private indexedDbDatabasesService: IndexedDbDatabasesService,
    @Inject(injectionTokens.appName.token) private appName: string
  ) {
    this.basicAppSettingsDbAdapter = indexedDbDatabasesService.basicAppSettings.value;
    this.choiceCatKey = getAppObjectKey([appSettingsChoiceKeys.driveStorageOption]);
    this.choiceKey = getAppObjectKey([appSettingsChoiceKeys.current]);
    this.keyPath = [this.choiceCatKey, this.choiceKey];
  }

  ngOnDestroy(): void {
    this.currentStorageOption.dispose();
    this.currentStorageOption.dispose();
  }

  updateCurrentStorageOption(storageOption: AppDriveStorageOption) {
    this.currentStorageOption.next(storageOption);
    this.writeCurrentToIndexedDb();
  }

  loadCurrentFromIndexedDb() {
    return new Promise<DriveStorageOption | null>((resolve, reject) => {
      this.basicAppSettingsDbAdapter.open(
        (_, db) => {
          dbRequestToPromise<AppSettingsChoice<AppDriveStorageOption<FileSystemDirectoryHandle>>>(
            this.basicAppSettingsDbAdapter.stores.choices.store(db).get(this.keyPath)
          ).then((dbResponse) => {
            const choice = dbResponse.value;

            if (choice) {
              this.currentStorageOption.next(choice.value);
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
              })
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
