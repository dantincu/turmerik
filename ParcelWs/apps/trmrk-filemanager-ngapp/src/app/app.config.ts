import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';

import { getServiceProviders } from '../trmrk-angular/services/dependency-injection/service-providers';

import { APP_NAME } from './services/common/core';
import { environment } from '../environments/environment';
import { AppService } from './services/common/app-service';
import { AppStateService } from './services/common/app-state-service';
import { AppConfig } from './services/common/app-config';
import { routes } from './app.routes';
import { StorageOptionServiceCore } from '../trmrk-filemanager-nglib/services/common/storage-option-service-core';

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
        const storageOptionService = inject(StorageOptionServiceCore);
        await storageOptionService.loadCurrentFromIndexedDb();
      }),
    ],
  }),
};
