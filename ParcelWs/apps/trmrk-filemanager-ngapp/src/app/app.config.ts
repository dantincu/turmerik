import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';

import { provideRouter } from '@angular/router';

import { MatDialogModule } from '@angular/material/dialog';

import { AsyncRequestStateManagerFactory } from '../trmrk/AsyncRequestStateManager';

import { BASIC_APP_SETTINGS_DB_ADAPTER } from '../trmrk-angular/services/pages/trmrk-app-themes-service';

import { AppStateServiceBase } from '../trmrk-angular/services/app-state-service-base';
import { AppConfigServiceBase } from '../trmrk-angular/services/app-config-service-base';

import { AppStateService } from './services/app-state-service';
import { AppConfigService } from './services/app-config-service';

import { iDbAdapters } from './services/adapters';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(MatDialogModule),
    { provide: AppStateServiceBase, useClass: AppStateService },
    { provide: AppConfigServiceBase, useClass: AppConfigService },
    { provide: BASIC_APP_SETTINGS_DB_ADAPTER, useValue: iDbAdapters.basicAppSettings },
    { provide: AsyncRequestStateManagerFactory },
    provideRouter(routes),
  ],
};
