import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';

import { provideRouter } from '@angular/router';

import { MatDialogModule } from '@angular/material/dialog';

import { AppStateServiceBase, AppConfigServiceBase } from 'trmrk-angular';
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
