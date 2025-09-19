import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

import { appConfigProvider } from './services/app-config-provider';
import { getServiceProviders } from '../trmrk-angular/services/dependency-injection/service-providers';

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
    appProviders: [appConfigProvider, provideHttpClient()],
  }),
};
