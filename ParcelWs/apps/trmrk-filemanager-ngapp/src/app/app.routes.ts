import { Routes } from '@angular/router';

import { getAppRoutes } from '../trmrk-angular/components/pages/routes';

import { TrmrkHomePage } from './components/pages/trmrk-home-page/trmrk-home-page';
import { TrmrkFolderPage } from './components/pages/trmrk-folder-page/trmrk-folder-page';
import { TrmrkAppSetup } from './components/pages/trmrk-app-setup/trmrk-app-setup-page';
import { trmrkAppHasBeenSetupGuard } from './guards/trmrk-app-has-been-setup-guard';

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

routes[0].canActivate = [trmrkAppHasBeenSetupGuard];

routes.splice(1, 0, {
  path: 'setup',
  component: TrmrkAppSetup,
});
