import { ApplicationConfig } from '@angular/core';

import { getServiceProviders } from '../trmrk-angular/services/dependency-injection/service-providers';

import { environment } from '../environments/environment';
import { AppStateService } from './services/app-state-service';
import { AppConfig } from './services/app-config';
import { iDbAdapters } from './services/adapters';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: getServiceProviders<AppConfig>({
    provide: {
      zoneChangeDetection: {
        provide: true,
      },
      appConfig: {
        isProd: environment.production,
        configMergeFactory: (baseConfig, envConfig) => {
          baseConfig.driveStorageOptions.push(...(envConfig.driveStorageOptions ?? []));
          return baseConfig;
        },
        configNormalizeFactory: (appConfig) => {
          appConfig.requiresSetup ??= true;
          return appConfig;
        },
      },
      appStateServiceType: AppStateService,
      basicAppSettingsIDbAdapter: iDbAdapters.basicAppSettings,
    },
    routes,
    appProviders: [],
  }),
};
