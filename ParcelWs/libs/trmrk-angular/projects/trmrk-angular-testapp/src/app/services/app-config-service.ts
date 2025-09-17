import { Injectable } from '@angular/core';

import { services } from 'trmrk-angular';

const AppConfigServiceBase = services.common.AppConfigServiceBase;

@Injectable({
  providedIn: 'root',
})
export class AppConfigService extends AppConfigServiceBase {}
