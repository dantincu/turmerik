import { Injectable } from '@angular/core';

import { TrmrkObservable } from 'trmrk-angular';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  isDarkMode = new TrmrkObservable<boolean>(false);
}
