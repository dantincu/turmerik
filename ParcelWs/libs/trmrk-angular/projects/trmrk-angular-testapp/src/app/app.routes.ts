import { inject } from '@angular/core';
import { Routes, Router } from '@angular/router';

import { TrmrkHomePage } from './trmrk-home-page/trmrk-home-page';
import { TrmrkFormsTestPage } from './trmrk-forms-test-page/trmrk-forms-test-page';
import { TrmrkCompaniesPanelPage } from './trmrk-companies-panel-page/trmrk-companies-panel-page';
import { TrmrkAppSettings } from './trmrk-app-settings/trmrk-app-settings';
import { TrmrkAppThemes } from './trmrk-app-themes/trmrk-app-themes';
import { TrmrkResetApp } from './trmrk-reset-app/trmrk-reset-app';
import { NotFound } from './trmrk-not-found/trmrk-not-found';

export const routes: Routes = [
  {
    path: 'settings',
    component: TrmrkAppSettings,
  },
  {
    path: 'themes',
    component: TrmrkAppThemes,
  },
  {
    path: 'reset-app',
    component: TrmrkResetApp,
  },
  {
    path: 'resetapp',
    redirectTo: () => {
      const router = inject(Router);

      return router.createUrlTree(['reset-app'], {
        queryParams: { reset: 'true' },
      });
    },
  },
  {
    path: 'forms',
    component: TrmrkFormsTestPage,
  },
  {
    path: 'companies',
    component: TrmrkCompaniesPanelPage,
  },
  {
    path: '',
    component: TrmrkHomePage,
  },
  {
    path: '**',
    component: NotFound,
  },
];
