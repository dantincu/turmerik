import { Injectable } from '@angular/core';
import { Router, UrlSerializer } from '@angular/router';

import { TrmrkUrlService } from './trmrk-url-service';

@Injectable({
  providedIn: 'root',
})
export class TrmrkUrlServiceFactory {
  constructor(private router: Router, private urlSerializer: UrlSerializer) {}

  create(): TrmrkUrlService {
    return new TrmrkUrlService(this.router, this.urlSerializer);
  }
}
