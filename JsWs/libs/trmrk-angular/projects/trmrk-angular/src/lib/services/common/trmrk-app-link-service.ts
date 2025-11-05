import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

import { NullOrUndef } from '../../../trmrk/core';

import { TrmrkUrl } from './types';
import { sessionUrlQueryKeys } from './trmrk-session-service';
import { TrmrkUrlNormalizerBase } from './trmrk-url-normalizer-base';

@Injectable({
  providedIn: 'root',
})
export class TrmrkAppLinkService {
  constructor(public trmrkUrlNormalizer: TrmrkUrlNormalizerBase) {
    this.getDefaultOpenInNewTabUrl = (trmrkUrl) =>
      this.getDefaultTabUrlCore(trmrkUrl, [sessionUrlQueryKeys.tabId]);

    this.getDefaultOpenInNewTabUrl = this.getDefaultOpenInNewTabUrl.bind(this);

    this.getDefaultOpenInNewBrowserTabUrl = (trmrkUrl) => this.getDefaultShareableTabUrl(trmrkUrl);

    this.getDefaultOpenInNewBrowserTabUrl = this.getDefaultOpenInNewBrowserTabUrl.bind(this);

    this.getDefaultShareableTabUrl = (trmrkUrl) =>
      this.getDefaultTabUrlCore(trmrkUrl, [
        sessionUrlQueryKeys.tabId,
        sessionUrlQueryKeys.sessionId,
      ]);

    this.getDefaultShareableTabUrl = this.getDefaultShareableTabUrl.bind(this);
  }

  getDefaultOpenInNewTabUrl: (trmrkUrl: TrmrkUrl) => TrmrkUrl;
  getDefaultOpenInNewBrowserTabUrl: (trmrkUrl: TrmrkUrl) => TrmrkUrl;
  getDefaultShareableTabUrl: (trmrkUrl: TrmrkUrl) => TrmrkUrl;

  getDefaultTabUrlCore(
    trmrkUrl: TrmrkUrl,
    urlQueryKeysToRemove: string[],
    paramsToAdd?: Params | NullOrUndef
  ) {
    trmrkUrl = {
      ...trmrkUrl,
    };

    let queryParams = trmrkUrl.queryParams;

    if (queryParams) {
      queryParams = { ...queryParams };

      if (urlQueryKeysToRemove.length > 0) {
        const existingKeysArr = Object.keys(queryParams);

        for (let key of urlQueryKeysToRemove) {
          if (existingKeysArr.indexOf(key) >= 0) {
            delete queryParams[key];
          }
        }
      }

      if (paramsToAdd) {
        queryParams = { ...queryParams, ...paramsToAdd };
      }

      trmrkUrl.queryParams = queryParams;
    }

    return trmrkUrl;
  }
}
