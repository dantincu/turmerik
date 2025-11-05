import { Routes } from '@angular/router';

import { getAppRoutes, defaultMainCommonRouteKeys } from '../trmrk-angular/components/pages/routes';

import { appRouteKeys } from './services/common/core';
import { TrmrkHomePage } from './components/pages/trmrk-home-page/trmrk-home-page';
import { TrmrkFolderPage } from '../trmrk-filemanager-nglib/components/pages/trmrk-folder-page/trmrk-folder-page';
import { TrmrkAppSetup } from './components/pages/trmrk-app-setup-page/trmrk-app-setup-page';
import { trmrkAppHasBeenSetupGuard } from '../trmrk-angular/guards/trmrk-app-has-been-setup-guard';
import { TrmrkLogConsoleTestPage } from './components/pages/trmrk-log-console-test-page/trmrk-log-console-test-page';
import { TrmrkInfiniteHeightPanelTestPage } from './components/pages/trmrk-infinite-height-panel-test-page/trmrk-infinite-height-panel-test-page';

export const routes: Routes = getAppRoutes([
  {
    path: appRouteKeys.Folder,
    component: TrmrkFolderPage,
  },
  {
    path: 'log-console-test',
    component: TrmrkLogConsoleTestPage,
  },
  {
    path: 'infinite-height-panel-test',
    component: TrmrkInfiniteHeightPanelTestPage,
  },
  {
    path: '',
    component: TrmrkHomePage,
  },
]);

routes[0].canActivate = [trmrkAppHasBeenSetupGuard()];

routes.splice(1, 0, {
  path: defaultMainCommonRouteKeys.Setup,
  component: TrmrkAppSetup,
});
