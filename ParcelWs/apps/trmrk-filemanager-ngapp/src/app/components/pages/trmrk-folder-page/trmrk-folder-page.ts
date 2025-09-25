import { Component, Inject } from '@angular/core';

import { AppServiceBase } from '../../../../trmrk-angular/services/common/app-service-base';

import { AppService } from '../../../services/app-service';

@Component({
  selector: 'trmrk-folder-page',
  imports: [],
  templateUrl: './trmrk-folder-page.html',
  styleUrl: './trmrk-folder-page.scss',
})
export class TrmrkFolderPage {
  constructor(@Inject(AppServiceBase) private appService: AppService) {}
}
