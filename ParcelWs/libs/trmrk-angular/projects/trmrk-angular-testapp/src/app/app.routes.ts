import { Routes } from '@angular/router';

import { createDevPageRoutes } from 'trmrk-angular';

import { HomePage } from './home-page/home-page';

export const routes: Routes = [
  ...createDevPageRoutes(),
  {
    path: '',
    component: HomePage,
  },
];
