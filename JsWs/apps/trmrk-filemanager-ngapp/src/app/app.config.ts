import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';

import { getServiceProviders } from '../trmrk-angular/services/dependency-injection/service-providers';
import { runOnceWhenValueIs } from '../trmrk-angular/services/common/TrmrkObservable';
import { TrmrkSessionService } from '../trmrk-angular/services/common/trmrk-session-service';
import { StorageOptionServiceCore } from '../trmrk-filemanager-nglib/services/common/storage-option-service-core';

import {
  TrmrkDriveItemsManagerServiceFactory,
  TrmrkDriveItemsManagerServiceFactoryBase,
} from '../trmrk-filemanager-nglib/services/common/driveitems-manager-service/trmrk-driveitems-manager-service-factory';

import {
  TrmrkFileManagerServiceFactory,
  TrmrkFileManagerServiceFactoryBase,
} from '../trmrk-filemanager-nglib/services/common/filemanager-service/trmrk-filemanager-service-factory';

import { APP_NAME } from './services/common/core';
import { environment } from '../environments/environment';
import { AppService } from './services/common/app-service';
import { AppStateService } from './services/common/app-state-service';
import { AppConfig } from './services/common/app-config';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: getServiceProviders<AppConfig>({
    isProdEnv: environment.production,
    appName: APP_NAME,
    provide: {
      zoneChangeDetection: {
        provide: true,
      },
      appConfig: {
        configMergeFactory: (baseConfig, envConfig) => {
          baseConfig.driveStorageOptions.push(...envConfig.driveStorageOptions);
          return baseConfig;
        },
        configNormalizeFactory: async (appConfig) => {
          appConfig.requiresSetup ??= true;
          return appConfig;
        },
      },
      appServiceType: AppService,
      appStateServiceType: AppStateService,
    },
    routes,
    appProviders: [
      provideAppInitializer(async () => {
        const appSessionService = inject(TrmrkSessionService);
        const storageOptionService = inject(StorageOptionServiceCore);

        await runOnceWhenValueIs(
          appSessionService.currentTab,
          null!,
          null,
          (value) => (value ?? null) !== null
        );

        await storageOptionService.loadCurrentFromIndexedDb(
          appSessionService.currentTab.value.tabId
        );
      }),
      {
        provide: TrmrkDriveItemsManagerServiceFactoryBase,
        useClass: TrmrkDriveItemsManagerServiceFactory,
      },
      {
        provide: TrmrkFileManagerServiceFactoryBase,
        useClass: TrmrkFileManagerServiceFactory,
      },
    ],
  }),
};
