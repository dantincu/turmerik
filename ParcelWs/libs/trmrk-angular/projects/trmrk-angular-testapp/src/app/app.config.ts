import { ApplicationConfig } from '@angular/core';

import { getServiceProviders } from 'trmrk-angular';

import { AppStateService } from './services/app-state-service';
import { AppConfigService } from './services/app-config-service';

import { iDbAdapters } from './services/adapters';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: getServiceProviders({
    provideZoneChangeDetection: {
      provide: true,
      opts: {},
      /* eventCoalescing: true */
    },
    AppStateServiceType: AppStateService,
    AppConfigServiceType: AppConfigService,
    basicAppSettingsIDbAdapter: iDbAdapters.basicAppSettings,
    routes,
  }),
};
