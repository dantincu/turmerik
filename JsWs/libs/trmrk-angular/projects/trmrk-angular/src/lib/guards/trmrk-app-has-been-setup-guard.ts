import { inject } from '@angular/core';
import { CanActivateFn, Router, NavigationExtras } from '@angular/router';

import { AppStateServiceBase } from '../services/common/app-state-service-base';
import { commonQueryKeys } from '../services/common/url';
import { appRouteKeys } from '../../app/services/common/core';

export const trmrkAppHasBeenSetupGuard = (): CanActivateFn => (route, state) => {
  const router = inject(Router);
  const appStateService = inject(AppStateServiceBase);

  if (!appStateService.hasBeenSetUp.value) {
    const setupPathName = `/${appRouteKeys.Setup}`;

    if (document.location.pathname !== setupPathName) {
      const navOpts: NavigationExtras = {
        queryParams: { ...route.queryParams, [commonQueryKeys.returnTo]: state.url },
        queryParamsHandling: 'merge',
      };

      if ((route.fragment ?? '') !== '') {
        navOpts.fragment = route.fragment!;
      }

      router.navigate([setupPathName], navOpts);
    }

    return false;
  }

  return true;
};
