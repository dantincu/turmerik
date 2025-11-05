import { Injectable } from '@angular/core';
import { Router, UrlSerializer } from '@angular/router';

import { TrmrkNormalizedUrlOpts } from './types';

import { TrmrkUrlNormalizerBase } from './trmrk-url-normalizer-base';
import { sessionUrlQueryKeys } from './trmrk-session-service';
import { TrmrkSessionService } from './trmrk-session-service';

@Injectable()
export class DefaultTrmrkUrlNormalizer extends TrmrkUrlNormalizerBase {
  constructor(
    private sessionService: TrmrkSessionService,
    router: Router,
    urlSerializer: UrlSerializer
  ) {
    super(router, urlSerializer);
  }

  normalizeUrlCore(normObj: TrmrkNormalizedUrlOpts) {
    const params = (normObj.url!.queryParams ??= {});

    this.addParamsKeyIfNotReq(
      params,
      sessionUrlQueryKeys.sessionId,
      this.sessionService.currentSession.value?.sessionId
    );

    this.addParamsKeyIfNotReq(
      params,
      sessionUrlQueryKeys.tabId,
      this.sessionService.currentTab.value?.tabId
    );

    return normObj;
  }
}
