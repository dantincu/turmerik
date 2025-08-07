import { inject } from '@angular/core';
import { Routes, Router } from '@angular/router';

import { HomePage } from './trmrk-home-page/trmrk-home-page';
import { TrmrkAppSettings } from './trmrk-app-settings/trmrk-app-settings';
import { TrmrkAppThemes } from './trmrk-app-themes/trmrk-app-themes';
import { TrmrkResetApp } from './trmrk-reset-app/trmrk-reset-app';
import { NotFound } from './trmrk-not-found/trmrk-not-found';

export const routes: Routes = [
  {
    path: 'app/settings',
    component: TrmrkAppSettings,
  },
  {
    path: 'app/themes',
    component: TrmrkAppThemes,
  },
  {
    path: 'app/reset-app',
    component: TrmrkResetApp,
  },
  {
    path: 'app/resetapp',
    redirectTo: () => {
      const router = inject(Router);

      return router.createUrlTree(['/app/reset-app'], {
        queryParams: { reset: 'true' },
      });
    },
  },
  {
    path: 'app',
    component: HomePage,
  },
  {
    path: '**',
    component: NotFound,
  },
];
