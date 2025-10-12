import { Injectable, OnDestroy } from '@angular/core';

import { NullOrUndef } from '../../../../trmrk/core';
import { AppStateServiceBase } from '../../../../trmrk-angular/services/common/app-state-service-base';
import { TrmrkFileManagerServiceFactory } from '../../../services/common/filemanager-service/trmrk-filemanager-service-factory';
import {
  TrmrkFileManagerServiceBase,
  TrmrkFileManagerServiceSetupArgs,
} from '../../../services/common/filemanager-service/trmrk-filemanager-service-base';

export interface TrmrkFolderViewServiceSetupArgs<TRootFolder> {
  fileManagerServiceArgs: TrmrkFileManagerServiceSetupArgs<TRootFolder>;
}

@Injectable()
export class TrmrkFolderViewService implements OnDestroy {
  public fileManagerService!: TrmrkFileManagerServiceBase<any>;

  errorTitle: string | null = null;
  errorMessage: string | null = null;
  hasError = false;
  showAppSetupLink = false;
  isLoading = false;

  constructor(
    public appStateService: AppStateServiceBase,
    private fileManagerServiceFactory: TrmrkFileManagerServiceFactory
  ) {}

  async setup<TRootFolder>(args: TrmrkFolderViewServiceSetupArgs<TRootFolder>) {
    this.fileManagerService = this.fileManagerServiceFactory.create(
      args.fileManagerServiceArgs.currentStorageOption
    );

    await this.fileManagerService.setup(args.fileManagerServiceArgs);
  }

  ngOnDestroy(): void {}

  runAppSetupClicked() {
    this.appStateService.performAppSetup.next(true, true);
  }
}
