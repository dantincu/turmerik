import { Injectable } from '@angular/core';
import { Params, Router, UrlSerializer } from '@angular/router';

import { NullOrUndef } from '../../../trmrk/core';

import { TrmrkNormalizedUrlOptsCore, TrmrkNormalizedUrl, TrmrkNormalizedUrlOpts } from './types';
import { normalizeUrlOpts } from './url';

@Injectable()
export abstract class TrmrkUrlNormalizerBase {
  constructor(protected router: Router, protected urlSerializer: UrlSerializer) {}

  abstract normalizeUrlCore(opts: TrmrkNormalizedUrlOpts): TrmrkNormalizedUrlOpts;

  normalizeUrl(opts: TrmrkNormalizedUrlOptsCore): TrmrkNormalizedUrl {
    let normObj = normalizeUrlOpts({
      ...opts,
      router: this.router,
      urlSerializer: this.urlSerializer,
    });

    normObj = this.normalizeUrlCore(normObj);
    return this.getRetObj(normObj);
  }

  addParamsKeyIfNotReq(params: Params, key: string, value: string | NullOrUndef) {
    if ((value ?? null) !== null && !(key in params)) {
      params[key] = value;
    }
  }

  getRetObj(normObj: TrmrkNormalizedUrlOptsCore) {
    const retObj: TrmrkNormalizedUrl = {
      urlStr: normObj.urlStr!,
      url: normObj.url!,
      urlTree: normObj.urlTree!,
    };

    return retObj;
  }
}
