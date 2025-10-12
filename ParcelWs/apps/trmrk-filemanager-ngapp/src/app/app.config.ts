import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';

import { AppSession } from '../trmrk-browser/indexedDB/databases/AppSessions';

import { getServiceProviders } from '../trmrk-angular/services/dependency-injection/service-providers';
import {
  runOnceWhenValueIs,
  TrmrkObservable,
} from '../trmrk-angular/services/common/TrmrkObservable';
import { TrmrkSessionService } from '../trmrk-angular/services/common/trmrk-session-service';
import { StorageOptionServiceCore } from '../trmrk-filemanager-nglib/services/common/storage-option-service-core';

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
          appSessionService.currentSession,
          null!,
          null,
          (value) => (value ?? null) !== null
        );

        await storageOptionService.loadCurrentFromIndexedDb(
          appSessionService.currentSession.value.sessionId
        );
      }),
    ],
  }),
};
