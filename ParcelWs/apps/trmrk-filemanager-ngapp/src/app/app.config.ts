import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';

import { provideRouter } from '@angular/router';

import { MatDialogModule } from '@angular/material/dialog';

import { AppStateServiceBase } from '../trmrk-angular/services/app-state-service-base';
import { AppConfigServiceBase } from '../trmrk-angular/services/app-config-service-base';

import { AppStateService } from './services/app-state-service';
import { AppConfigService } from './services/app-config-service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(MatDialogModule),
    { provide: AppStateServiceBase, useClass: AppStateService },
    { provide: AppConfigServiceBase, useClass: AppConfigService },
  ],
};
