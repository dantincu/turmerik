import { Injectable } from '@angular/core';

import { TrmrkObservable } from './TrmrkObservable';

@Injectable()
export abstract class AppStateServiceBase {
  isDarkMode = new TrmrkObservable<boolean>(false);
  showAppBar = new TrmrkObservable<boolean>(true);
}
