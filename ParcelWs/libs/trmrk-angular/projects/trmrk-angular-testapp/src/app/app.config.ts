import { ApplicationConfig } from '@angular/core';

import { services } from 'trmrk-angular';

const getServiceProviders = services.dependencyInjection.getServiceProviders;

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
