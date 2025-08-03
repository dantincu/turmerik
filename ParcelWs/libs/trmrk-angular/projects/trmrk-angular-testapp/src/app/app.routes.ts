import { Routes } from '@angular/router';

import { createDevPageRoutes } from 'trmrk-angular';

import { HomePage } from './home-page/home-page';
import { TrmrkSettings } from './trmrk-settings/trmrk-settings';
import { TrmrkAppThemes } from './trmrk-app-themes/trmrk-app-themes';
import { TrmrkResetApp } from './trmrk-reset-app/trmrk-reset-app';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
  ...createDevPageRoutes(),
  {
    path: 'settings',
    component: TrmrkSettings,
  },
  {
    path: 'app-themes',
    component: TrmrkAppThemes,
  },
  {
    path: 'reset-app',
    component: TrmrkResetApp,
  },
  {
    path: '',
    component: HomePage,
  },
  {
    path: '**',
    component: NotFound,
  },
];
