import { Routes } from '@angular/router';

import { getAppRoutes } from '../trmrk-angular/components/pages/routes';

import { TrmrkHomePage } from './components/pages/trmrk-home-page/trmrk-home-page';
import { TrmrkFolderPage } from './components/pages/trmrk-folder-page/trmrk-folder-page';

export const routes: Routes = getAppRoutes([
  {
    path: 'folder',
    component: TrmrkFolderPage,
  },
  {
    path: '',
    component: TrmrkHomePage,
  },
]);
