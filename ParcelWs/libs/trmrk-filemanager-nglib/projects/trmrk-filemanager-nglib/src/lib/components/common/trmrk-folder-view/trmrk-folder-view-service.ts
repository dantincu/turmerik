import { Injectable, OnDestroy } from '@angular/core';

import { StorageOptionServiceCore } from '../../../services/common/storage-option-service-core';

import { TrmrkDriveItemsViewService } from '../trmrk-drive-items-view/trmrk-drive-items-view-service';

@Injectable()
export class TrmrkFolderViewService implements OnDestroy {
  constructor(
    private storageOptionService: StorageOptionServiceCore,
    private driveItemsViewService: TrmrkDriveItemsViewService
  ) {}

  ngOnDestroy(): void {}

  setup() {
    return this.driveItemsViewService.setup({
      currentStorageOption: this.storageOptionService.currentStorageOption.value!,
      currentStorageUserIdnf: this.storageOptionService.currentUserIdnf.value,
    });
  }
}
