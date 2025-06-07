import { Routes } from '@angular/router';

import { createDevPageRoutes } from 'trmrk-angular';

import { HomePage } from './home-page/home-page';
import { TrmrkSettings } from './trmrk-settings/trmrk-settings';

export const routes: Routes = [
  ...createDevPageRoutes(),
  {
    path: 'settings',
    component: TrmrkSettings,
  },
  {
    path: '',
    component: HomePage,
  },
];
