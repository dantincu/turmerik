import { ApplicationConfig } from '@angular/core';

import { services } from 'trmrk-angular';

const getServiceProviders = services.dependencyInjection.getServiceProviders;

import { AppStateService } from './services/app-state-service';

import { iDbAdapters } from './services/adapters';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: getServiceProviders({
    provide: {
      zoneChangeDetection: {
        provide: true,
        /* eventCoalescing: true */
      },
      appStateServiceType: AppStateService,
      basicAppSettingsIDbAdapter: iDbAdapters.basicAppSettings,
    },
    routes,
    appProviders: [],
  }),
};
