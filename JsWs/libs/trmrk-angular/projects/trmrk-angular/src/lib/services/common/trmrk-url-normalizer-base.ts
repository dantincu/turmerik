import { Injectable } from '@angular/core';
import { Params, Router, UrlSerializer, UrlTree } from '@angular/router';

import { NullOrUndef } from '../../../trmrk/core';

import {
  TrmrkNormalizedUrlOptsCore,
  TrmrkNormalizedUrl,
  TrmrkNormalizedUrlOpts,
  TrmrkUrl,
} from './types';
import { normalizeUrlOpts } from './url';

@Injectable()
export abstract class TrmrkUrlNormalizerBase {
  constructor(protected router: Router, protected urlSerializer: UrlSerializer) {}

  abstract normalizeUrlCore(opts: TrmrkNormalizedUrlOpts): TrmrkNormalizedUrlOpts;

  normalizeUrlStr(urlStr: string | NullOrUndef) {
    return this.normalizeUrl({ urlStr })?.urlStr ?? null;
  }

  normalizeUrlTree(urlTree: UrlTree | NullOrUndef) {
    return this.normalizeUrl({ urlTree })?.urlTree ?? null;
  }

  normalizeTrmrkUrl(url: TrmrkUrl | NullOrUndef) {
    return this.normalizeUrl({ url })?.url ?? null;
  }

  normalizeUrl(opts: TrmrkNormalizedUrlOptsCore | NullOrUndef) {
    if ((opts ?? null) === null) {
      return null;
    }

    let normObj = normalizeUrlOpts({
      ...opts,
      router: this.router,
      urlSerializer: this.urlSerializer,
    });

    normObj = this.normalizeUrlCore(normObj);
    return this.getRetObj(normObj);
  }

  addParamsKeyIfReq(params: Params, key: string, value: string | NullOrUndef) {
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
