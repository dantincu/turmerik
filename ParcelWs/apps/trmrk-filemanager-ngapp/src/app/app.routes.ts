import { inject } from '@angular/core';
import { Routes, Router } from '@angular/router';

import { AppConfigServiceBase } from '../trmrk-angular/services/app-config-service-base';

import { TrmrkHomePage } from './components/pages/trmrk-home-page/trmrk-home-page';
import { TrmrkAppSettings } from './components/pages/trmrk-app-settings/trmrk-app-settings';
import { TrmrkResetApp } from './components/pages/trmrk-reset-app/trmrk-reset-app';
import { NotFound } from './components/pages/trmrk-not-found/trmrk-not-found';

export const routes: Routes = [
  {
    path: 'app',
    children: [
      {
        path: 'settings',
        component: TrmrkAppSettings,
      },
      {
        path: 'reset-app',
        component: TrmrkResetApp,
      },
      {
        path: 'reset',
        redirectTo: () => {
          const router = inject(Router);
          const appConfigService = inject(AppConfigServiceBase);

          return router.createUrlTree([`${appConfigService.routeBasePath}/reset-app`], {
            queryParams: { reset: 'true' },
          });
        },
      },
      {
        path: '',
        component: TrmrkHomePage,
      },
    ],
  },
  {
    path: '**',
    component: NotFound,
  },
];
