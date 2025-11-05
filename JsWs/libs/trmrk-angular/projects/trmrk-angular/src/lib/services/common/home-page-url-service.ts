import { Injectable } from '@angular/core';

import { TrmrkUrlService } from './trmrk-url-service';
import { TrmrkUrlServiceFactory } from './trmrk-url-service-factory';

@Injectable({
  providedIn: 'root',
})
export class HomePageUrlService {
  public readonly svc: TrmrkUrlService;

  constructor(private urlServiceFactory: TrmrkUrlServiceFactory) {
    this.svc = this.urlServiceFactory.create();
  }
}
