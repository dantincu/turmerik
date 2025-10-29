import { Component, Input } from '@angular/core';

import { NullOrUndef } from '../../../../trmrk/core';

import { TrmrkDriveItemsView } from '../trmrk-drive-items-view/trmrk-drive-items-view';
import { TrmrkDriveItemsViewService } from '../trmrk-drive-items-view/trmrk-drive-items-view-service';
import { TrmrkFolderViewService } from './trmrk-folder-view-service';

@Component({
  selector: 'trmrk-folder-view',
  imports: [TrmrkDriveItemsView],
  templateUrl: './trmrk-folder-view.html',
  providers: [TrmrkDriveItemsViewService, TrmrkFolderViewService],
  styleUrl: './trmrk-folder-view.scss',
})
export class TrmrkFolderView {
  @Input() trmrkLayoutKey?: string | NullOrUndef;

  constructor(public service: TrmrkFolderViewService) {
    setTimeout(() => {
      service.setup();
    });
  }
}
