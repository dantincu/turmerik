import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';

import { getServiceProviders } from '../trmrk-angular/services/dependency-injection/service-providers';

import { APP_NAME } from './services/common/core';
import { environment } from '../environments/environment';
import { AppService } from './services/common/app-service';
import { AppStateService } from './services/common/app-state-service';
import { AppConfig } from './services/common/app-config';
import { routes } from './app.routes';
import { IndexedDbDatabasesService } from './services/common/indexedDb/indexed-db-databases-service';
import { StorageOptionService } from './services/common/storage-option-service';

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
      basicAppSettingsIDbAdapter: () => {
        const indexedDbDatabasesService = inject(IndexedDbDatabasesService);
        const adapter = indexedDbDatabasesService.basicAppSettings.value;
        return adapter;
      },
    },
    routes,
    appProviders: [
      provideAppInitializer(async () => {
        const storageOptionService = inject(StorageOptionService);
        await storageOptionService.loadCurrentFromIndexedDb();
      }),
    ],
  }),
};
