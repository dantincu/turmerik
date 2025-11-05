import { Injectable } from '@angular/core';
import { Router, UrlSerializer } from '@angular/router';

import { TrmrkNormalizedUrlOptsCore, TrmrkNormalizedUrl } from './types';
import { TrmrkObservable } from './TrmrkObservable';

import { normalizeUrlOpts } from './url';

@Injectable()
export class TrmrkUrlService {
  obs = new TrmrkObservable<TrmrkNormalizedUrl>(null!);

  constructor(private router: Router, private urlSerializer: UrlSerializer) {}

  next(opts: TrmrkNormalizedUrlOptsCore) {
    const normalizedOpts = normalizeUrlOpts({
      ...opts,
      router: this.router,
      urlSerializer: this.urlSerializer,
    });

    const url: TrmrkNormalizedUrl = {
      urlStr: normalizedOpts.urlStr!,
      url: normalizedOpts.url!,
      urlTree: normalizedOpts.urlTree!,
    };

    this.obs.next(url);
    return url;
  }
}
