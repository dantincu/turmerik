import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AppStateServiceBase } from '../../trmrk-angular/services/common/app-state-service-base';
import { commonQueryKeys } from '../../trmrk-angular/services/common/url';

import { AppStateService } from '../services/common/app-state-service';

export const trmrkAppHasBeenSetupGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const appStateService = inject(AppStateServiceBase) as AppStateService;

  if (!appStateService.hasBeenSetUp.value) {
    router.navigate(['/setup'], {
      queryParams: { [commonQueryKeys.returnTo]: state.url },
    });

    return false;
  }

  return true;
};
