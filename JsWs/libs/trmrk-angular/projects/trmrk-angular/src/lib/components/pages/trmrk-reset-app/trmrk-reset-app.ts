import { Component, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';

import { TrmrkHorizStrip } from '../../common/trmrk-horiz-strip/trmrk-horiz-strip';
import { TrmrkUserMessage } from '../../common/trmrk-user-message/trmrk-user-message';
import { TrmrkLoading } from '../../common/trmrk-loading/trmrk-loading';
import { TrmrkAppPage } from '../../common/trmrk-app-page/trmrk-app-page';

import { TrmrkResetAppService } from '../../../services/pages/reset-app-service/trmrk-reset-app-service';
import { UserMessageLevel } from '../../../../trmrk/core';

@Component({
  selector: 'trmrk-reset-app',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    TrmrkAppPage,
    TrmrkUserMessage,
    TrmrkHorizStrip,
    TrmrkLoading,
  ],
  templateUrl: './trmrk-reset-app.html',
  styleUrl: './trmrk-reset-app.scss',
})
export class TrmrkResetApp {
  @ViewChild(MatMenu) optionsMenu!: MatMenu;

  UserMessageLevel = UserMessageLevel;

  constructor(public trmrkResetAppService: TrmrkResetAppService, route: ActivatedRoute) {
    trmrkResetAppService.init({
      route,
    });
  }
}
