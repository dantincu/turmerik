import { Routes } from '@angular/router';

import { getAppRoutes } from '../trmrk-angular/components/pages/routes';

import { TrmrkHomePage } from './components/pages/trmrk-home-page/trmrk-home-page';

export const routes: Routes = getAppRoutes([
  {
    path: '',
    component: TrmrkHomePage,
  },
]);
