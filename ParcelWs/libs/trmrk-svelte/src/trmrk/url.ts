import { NullOrUndef, StrMap } from '../trmrk/core';
import { trimEndStr, serializeMap } from '../trmrk/str';

export const getBaseLocation = () => {
  let baseLocation = [window.location.protocol, window.location.host].join(
    '//'
  );

  return baseLocation;
};

export const isAbsoluteUri = (uri: string) =>
  /^[a-zA-Z][a-zA-Z0-9\+\-\.]*\:\/{2}/.test(uri);

export const normalizeAbsoluteUri = (
  uri: string,
  baseLocation?: string | NullOrUndef
) => {
  if (!isAbsoluteUri(uri)) {
    baseLocation ??= getBaseLocation();
    uri = [baseLocation, uri].join('/');
  }

  return uri;
};

export const getRelUri = (uri: string) => {
  if (isAbsoluteUri(uri)) {
    uri = uri.split('/').slice(3).join('/');
  }

  return uri;
};

export const newRelUri = (
  relUri: string,
  currentPath?: string | NullOrUndef,
  goUpLevelsCount?: number | NullOrUndef
) => {
  currentPath ??= window.location.pathname;
  goUpLevelsCount ??= 0;

  if (goUpLevelsCount > 0) {
    let pathParts = currentPath.split('/');
    pathParts.splice(-1 * goUpLevelsCount, goUpLevelsCount);
    currentPath = pathParts.join('/');
  }

  currentPath = trimEndStr(currentPath, '/');

  let newUri = currentPath;

  if (relUri.length) {
    newUri = [currentPath, relUri].join('/');
  }

  relUri = trimEndStr(relUri, '/');
  return newUri;
};

export const serializeQueryParams = (paramsObj: StrMap<string>) =>
  serializeMap(paramsObj, {
    keyValueJoinFactory: (key, value) => [key, value].join('='),
    propsJoinFactory: (prop1, prop2) => [prop1, prop2].join('&'),
  });

export const replaceQueryParams = (
  paramsStr?: string | StrMap<string> | NullOrUndef,
  absoluteUri?: string | NullOrUndef,
  returnAbsoluteUri?: boolean | NullOrUndef
) => {
  paramsStr ??= '';
  returnAbsoluteUri ??= true;

  if ('object' === typeof paramsStr) {
    paramsStr = serializeQueryParams(paramsStr);
  }

  absoluteUri ??= window.location.href;

  if (!returnAbsoluteUri) {
    absoluteUri = getRelUri(absoluteUri);
  }

  let retUri = absoluteUri.split('?')[0];

  if (paramsStr.length) {
    retUri = [retUri, paramsStr].join('?');
  }

  return retUri;
};
