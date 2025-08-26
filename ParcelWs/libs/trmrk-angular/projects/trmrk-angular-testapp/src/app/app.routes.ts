import { inject } from '@angular/core';
import { Routes, Router } from '@angular/router';

import { AppConfigServiceBase } from 'trmrk-angular';

import { TrmrkHomePage } from './components/pages/trmrk-home-page/trmrk-home-page';
import { TrmrkFormsTestPage } from './components/pages/trmrk-forms-test-page/trmrk-forms-test-page';
import { TrmrkCompaniesPanelPage } from './components/pages/trmrk-companies-panel-page/trmrk-companies-panel-page';
import { TrmrkAppSettings } from './components/pages/trmrk-app-settings/trmrk-app-settings';
import { TrmrkAppThemes } from './components/pages/trmrk-app-themes/trmrk-app-themes';
import { TrmrkResetApp } from './components/pages/trmrk-reset-app/trmrk-reset-app';
import { TrmrkAppTreePage } from './components/pages/trmrk-app-tree-page/trmrk-app-tree-page';
import { TrmrkButtonsPage } from './components/pages/trmrk-buttons-page/trmrk-buttons-page';
import { TrmrkFormFieldsPage } from './components/pages/trmrk-form-fields-page/trmrk-form-fields-page';
import { TrmrkHorizStripsPage } from './components/pages/trmrk-horiz-strips-page/trmrk-horiz-strips-page';
import { TrmrkUserMessages } from './components/pages/trmrk-user-messages/trmrk-user-messages';
import { TrmrkColoredText } from './components/pages/trmrk-colored-text/trmrk-colored-text';
import { TrmrkMiscPage } from './components/pages/trmrk-misc-page/trmrk-misc-page';
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
        path: 'themes',
        component: TrmrkAppThemes,
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

          return router.createUrlTree(
            [`${appConfigService.routeBasePath}/reset-app`],
            {
              queryParams: { reset: 'true' },
            }
          );
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
        path: 'app-tree',
        component: TrmrkAppTreePage,
      },
      {
        path: 'buttons',
        component: TrmrkButtonsPage,
      },
      {
        path: 'form-fields',
        component: TrmrkFormFieldsPage,
      },
      {
        path: 'horiz-strips',
        component: TrmrkHorizStripsPage,
      },
      {
        path: 'user-messages',
        component: TrmrkUserMessages,
      },
      {
        path: 'colored-text',
        component: TrmrkColoredText,
      },
      {
        path: 'misc',
        component: TrmrkMiscPage,
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
