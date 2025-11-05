import { UrlTree, UrlSerializer, Params, Router, UrlCreationOptions } from '@angular/router';

import { serializeQueryParams } from '../../../trmrk/url';
import { trimFullStr } from '../../../trmrk/str';
import { mapPropNamesToThemselves } from '../../../trmrk/propNames';

import { TrmrkUrl, TrmrkUrlType, TrmrkNormalizedUrlOpts } from './types';

export const commonQueryKeys = Object.freeze(
  mapPropNamesToThemselves({
    returnTo: '',
    reset: '',
  })
);

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
  const parsed = new URL(url, location.origin);

  const retObj: TrmrkUrl = {
    path: parsed.pathname,
    queryParams: trmrkUrlParamsFromNativeObj(parsed.searchParams),
    fragment: parsed.hash ? parsed.hash.substring(1) : undefined,
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
      queryParamsHandling: 'merge',
      fragment: trmrkUrl.fragment ?? undefined,
    };
  }

  const ngUrlTree = router.createUrlTree(trmrkUrl.path as string[], navigationExtras);
  return ngUrlTree;
};

export const normalizeUrlOpts = (opts: TrmrkNormalizedUrlOpts) => {
  if (opts.url) {
    opts.urlTree ??= trmrkUrlToNgUrlTree(opts.url, opts.router!);
    opts.urlStr ??= opts.urlSerializer!.serialize(opts.urlTree);
  } else if (opts.urlTree) {
    opts.url ??= trmrkUrlFromNgUrlTree(opts.urlTree, opts.urlSerializer!);
    opts.urlStr ??= opts.urlSerializer!.serialize(opts.urlTree);
  } else if (opts.urlStr) {
    opts.url ??= trmrkUrlFromString(opts.urlStr);
    opts.urlTree ??= opts.urlSerializer!.parse(opts.urlStr);
  }

  return opts;
};
