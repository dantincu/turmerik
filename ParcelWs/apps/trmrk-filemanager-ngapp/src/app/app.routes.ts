import { Routes } from '@angular/router';

import { getAppRoutes, defaultMainCommonRouteKeys } from '../trmrk-angular/components/pages/routes';

import { appRouteKeys } from './services/common/core';
import { TrmrkHomePage } from './components/pages/trmrk-home-page/trmrk-home-page';
import { TrmrkFolderPage } from './components/pages/trmrk-folder-page/trmrk-folder-page';
import { TrmrkAppSetup } from './components/pages/trmrk-app-setup/trmrk-app-setup-page';
import { trmrkAppHasBeenSetupGuard } from './guards/trmrk-app-has-been-setup-guard';

export const routes: Routes = getAppRoutes([
  {
    path: appRouteKeys.Folder,
    component: TrmrkFolderPage,
  },
  {
    path: '',
    component: TrmrkHomePage,
  },
]);

routes[0].canActivate = [trmrkAppHasBeenSetupGuard];

routes.splice(1, 0, {
  path: defaultMainCommonRouteKeys.Setup,
  component: TrmrkAppSetup,
});
