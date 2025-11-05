import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { TrmrkAppPage } from '../../common/trmrk-app-page/trmrk-app-page';
import { injectionTokens } from '../../../services/dependency-injection/injection-tokens';
import { NgAppConfigCore } from '../../../services/common/app-config';
import { TrmrkObservable } from '../../../services/common/TrmrkObservable';

@Component({
  selector: 'trmrk-not-found',
  imports: [TrmrkAppPage, MatIconModule, MatButtonModule],
  templateUrl: './trmrk-not-found.html',
  styleUrl: './trmrk-not-found.scss',
})
export class NotFound {
  constructor(
    @Inject(injectionTokens.appConfig.token) public appConfig: TrmrkObservable<NgAppConfigCore>
  ) {}
}
