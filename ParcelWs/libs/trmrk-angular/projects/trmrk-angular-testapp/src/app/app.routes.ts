import { inject } from '@angular/core';
import { Routes, Router } from '@angular/router';

import { TrmrkHomePage } from './trmrk-home-page/trmrk-home-page';
import { TrmrkFormsTestPage } from './trmrk-forms-test-page/trmrk-forms-test-page';
import { TrmrkCompaniesPanelPage } from './trmrk-companies-panel-page/trmrk-companies-panel-page';
import { TrmrkAppSettings } from './trmrk-app-settings/trmrk-app-settings';
import { TrmrkAppThemes } from './trmrk-app-themes/trmrk-app-themes';
import { TrmrkResetApp } from './trmrk-reset-app/trmrk-reset-app';
import { TrmrkAppTreePage } from './trmrk-app-tree-page/trmrk-app-tree-page';
import { TrmrkButtonsPage } from './trmrk-buttons-page/trmrk-buttons-page';
import { TrmrkFormFieldsPage } from './trmrk-form-fields-page/trmrk-form-fields-page';
import { TrmrkHorizStripsPage } from './trmrk-horiz-strips-page/trmrk-horiz-strips-page';
import { TrmrkUserMessages } from './trmrk-user-messages/trmrk-user-messages';
import { TrmrkColoredText } from './trmrk-colored-text/trmrk-colored-text';
import { TrmrkMiscPage } from './trmrk-misc-page/trmrk-misc-page';
import { NotFound } from './trmrk-not-found/trmrk-not-found';

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
