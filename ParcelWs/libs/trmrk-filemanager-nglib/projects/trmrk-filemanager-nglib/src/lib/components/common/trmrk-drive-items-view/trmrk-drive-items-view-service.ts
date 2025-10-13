import { Injectable } from '@angular/core';

import { NullOrUndef } from '../../../../trmrk/core';
import { AppStateServiceBase } from '../../../../trmrk-angular/services/common/app-state-service-base';

export interface TrmrkDriveItemsViewServiceSetupArgs<TRootFolder> {}

@Injectable()
export class TrmrkDriveItemsViewService {
  errorTitle: string | null = null;
  errorMessage: string | null = null;
  hasError = false;
  showAppSetupLink = false;
  isLoading = false;

  constructor(public appStateService: AppStateServiceBase) {}

  async setup<TRootFolder>(args: TrmrkDriveItemsViewServiceSetupArgs<TRootFolder>) {}

  ngOnDestroy(): void {}

  runAppSetupClicked() {
    this.appStateService.performAppSetup.next(true, true);
  }
}
