import { Injectable } from '@angular/core';

@Injectable()
export class AppConfigServiceBase {
  isWebApp = true;
  routeBasePath = '/app';
}
