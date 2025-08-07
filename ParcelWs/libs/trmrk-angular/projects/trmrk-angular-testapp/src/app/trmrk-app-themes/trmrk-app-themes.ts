import { Component } from '@angular/core';

import { TrmrkAppBar } from 'trmrk-angular';

import { TrmrkPanelListService } from '../services/trmrk-panel-list-service';
import { TrmrkAppThemesListView } from '../trmrk-app-themes-list-view/trmrk-app-themes-list-view';

@Component({
  selector: 'trmrk-app-themes',
  imports: [TrmrkAppBar, TrmrkAppThemesListView],
  templateUrl: './trmrk-app-themes.html',
  styleUrl: './trmrk-app-themes.scss',
  providers: [TrmrkPanelListService],
})
export class TrmrkAppThemes {}
