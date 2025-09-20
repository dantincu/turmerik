import { ApplicationConfig } from '@angular/core';

import { getServiceProviders } from '../trmrk-angular/services/dependency-injection/service-providers';

import { environment } from '../environments/environment';
import { AppService } from './services/app-service';
import { AppStateService } from './services/app-state-service';
import { AppConfig } from './services/app-config';
import { iDbAdapters } from './services/adapters';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: getServiceProviders<AppConfig>({
    isProdEnv: environment.production,
    provide: {
      zoneChangeDetection: {
        provide: true,
      },
      appConfig: {
        configMergeFactory: (baseConfig, envConfig) => {
          baseConfig.driveStorageOptions.push(...(envConfig.driveStorageOptions ?? []));
          return baseConfig;
        },
        configNormalizeFactory: (appConfig) => {
          appConfig.requiresSetup ??= true;
          return appConfig;
        },
      },
      appServiceType: AppService,
      appStateServiceType: AppStateService,
      basicAppSettingsIDbAdapter: iDbAdapters.basicAppSettings,
    },
    routes,
    appProviders: [],
  }),
};
