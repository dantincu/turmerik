import { ApplicationConfig } from '@angular/core';

import { services } from 'trmrk-angular';

import { AppService } from './services/app-service';
import { AppStateService } from './services/app-state-service';
import { iDbAdapters } from './services/adapters';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

const getServiceProviders = services.dependencyInjection.getServiceProviders;

export const appConfig: ApplicationConfig = {
  providers: getServiceProviders({
    isProdEnv: environment.production,
    provide: {
      zoneChangeDetection: {
        provide: true,
        /* eventCoalescing: true */
      },
      appServiceType: AppService,
      appStateServiceType: AppStateService,
      basicAppSettingsIDbAdapter: iDbAdapters.basicAppSettings,
    },
    routes,
    appProviders: [],
  }),
};
