import { Injectable, OnDestroy } from '@angular/core';

import { NullOrUndef } from '../../../../trmrk/core';
import { AppStateServiceBase } from '../../../../trmrk-angular/services/common/app-state-service-base';

export interface TrmrkFolderViewServiceSetupArgs {}

@Injectable()
export class TrmrkFolderViewService implements OnDestroy {
  errorTitle: string | null = null;
  errorMessage: string | null = null;
  hasError = false;
  showAppSetupLink = false;
  isLoading = false;

  constructor(public appStateService: AppStateServiceBase) {}

  setup(args: TrmrkFolderViewServiceSetupArgs) {}

  ngOnDestroy(): void {}

  runAppSetupClicked() {
    this.appStateService.performAppSetup.next(true, true);
  }
}
