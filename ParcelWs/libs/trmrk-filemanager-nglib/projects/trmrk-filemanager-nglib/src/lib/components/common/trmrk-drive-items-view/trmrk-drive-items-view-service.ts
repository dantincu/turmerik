import { Injectable } from '@angular/core';

import { NullOrUndef } from '../../../../trmrk/core';
import { AppStateServiceBase } from '../../../../trmrk-angular/services/common/app-state-service-base';

import { TrmrkDriveItemsManagerServiceFactoryBase } from '../../../services/common/driveitems-manager-service/trmrk-driveitems-manager-service-factory';
import { TrmrkDriveItemsManagerSetupArgsCore } from '../../../services/common/driveitems-manager-service/trmrk-driveitems-manager-core';
import { TrmrkDriveItemsManagerServiceBase } from '../../../services/common/driveitems-manager-service/trmrk-driveitems-manager-service-base';

@Injectable()
export class TrmrkDriveItemsViewService {
  errorTitle: string | null = null;
  errorMessage: string | null = null;
  hasError = false;
  showAppSetupLink = false;
  isLoading = false;

  private driveItemsManagerService!: TrmrkDriveItemsManagerServiceBase<
    TrmrkDriveItemsManagerSetupArgsCore<any>,
    any
  >;

  constructor(
    public appStateService: AppStateServiceBase,
    private driveItemsManagerServiceFactory: TrmrkDriveItemsManagerServiceFactoryBase
  ) {}

  ngOnDestroy(): void {}

  async setup<TRootFolder>(args: TrmrkDriveItemsManagerSetupArgsCore<TRootFolder>) {
    this.driveItemsManagerService = this.driveItemsManagerServiceFactory.create(
      args.currentStorageOption
    );

    await this.driveItemsManagerService.setup(args);
  }

  runAppSetupClicked() {
    this.appStateService.performAppSetup.next(true, true);
  }
}
