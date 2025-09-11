import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { TrmrkAppPage } from '../../../../trmrk-angular/components/common/trmrk-app-page/trmrk-app-page';

@Component({
  selector: 'trmrk-not-found',
  imports: [TrmrkAppPage, MatIconModule, MatButtonModule],
  templateUrl: './trmrk-not-found.html',
  styleUrl: './trmrk-not-found.scss',
})
export class NotFound {}
