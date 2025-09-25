import { UrlTree, UrlSerializer, Params, Router, UrlCreationOptions } from '@angular/router';

import { serializeQueryParams } from '../../../trmrk/url';
import { trimFullStr } from '../../../trmrk/str';

import { TrmrkUrl, TrmrkUrlType } from './types';

export const serializeTrmrkUrl = (trmrkUrl: TrmrkUrl) => {
  const location = document.location;

  const urlParts: string[] = [
    location.protocol,
    '',
    location.host,
    ...(trmrkUrl.path as string[]).map((part) => trimFullStr(part, '/')),
  ];

  let serialized = urlParts.join('/');

  if (trmrkUrl.queryParams) {
    const query = serializeQueryParams(trmrkUrl.queryParams);

    if (query !== '') {
      serialized = [serialized, query].join('?');
    }
  }

  return serialized;
};

export const trmrkUrlParamsFromNativeObj = (params: URLSearchParams) => {
  const retObj: Params = {};
  params.forEach((value, key) => (retObj[key] = value));
  return retObj;
};

export const trmrkUrlFromString = (url: string) => {
  const parsed = new URL(url);

  const retObj: TrmrkUrl = {
    path: parsed.pathname,
    queryParams: trmrkUrlParamsFromNativeObj(parsed.searchParams),
  };

  return retObj;
};

export const trmrkUrlFromNgUrlTree = (urlTree: UrlTree, urlSerializer: UrlSerializer) => {
  const serializedUrl = urlSerializer.serialize(urlTree);
  const trmrkUrl = trmrkUrlFromString(serializedUrl);
  return trmrkUrl;
};

export const normalizeTrmrkUrl = (trmrkUrl: TrmrkUrlType) => {
  if (((trmrkUrl as string | string[]).length ?? null) !== null) {
    trmrkUrl = {
      path: trmrkUrl,
    } as TrmrkUrl;
  } else {
    trmrkUrl = { ...(trmrkUrl as TrmrkUrl) };
  }

  if ('string' === typeof trmrkUrl.path) {
    trmrkUrl.path = [trmrkUrl.path];
  }

  return trmrkUrl;
};

export const trmrkUrlToNgUrlTree = (trmrkUrl: TrmrkUrl, router: Router) => {
  let navigationExtras: UrlCreationOptions | undefined = undefined;

  if (trmrkUrl.queryParams) {
    navigationExtras = {
      queryParams: trmrkUrl.queryParams,
    };
  }

  const ngUrlTree = router.createUrlTree(trmrkUrl.path as string[], navigationExtras);
  return ngUrlTree;
};
