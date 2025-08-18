import { Component } from '@angular/core';

import { TrmrkAppPage } from 'trmrk-angular';

import { TrmrkCompaniesAppPanel } from '../trmrk-companies-app-panel/trmrk-companies-app-panel';

@Component({
  selector: 'trmrk-companies-panel-page',
  imports: [TrmrkAppPage, TrmrkCompaniesAppPanel],
  templateUrl: './trmrk-companies-panel-page.html',
  styleUrl: './trmrk-companies-panel-page.scss',
})
export class TrmrkCompaniesPanelPage {}
