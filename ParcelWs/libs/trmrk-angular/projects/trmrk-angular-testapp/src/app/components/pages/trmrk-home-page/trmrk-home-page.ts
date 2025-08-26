import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';

import { TrmrkAppPage } from 'trmrk-angular';

import { TrmrkAppIcon } from '../../common/trmrk-app-icon/trmrk-app-icon';

@Component({
  selector: 'trmrk-home-page',
  imports: [RouterModule, MatMenuModule, TrmrkAppIcon, TrmrkAppPage],
  templateUrl: './trmrk-home-page.html',
  styleUrl: './trmrk-home-page.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TrmrkHomePage {}
