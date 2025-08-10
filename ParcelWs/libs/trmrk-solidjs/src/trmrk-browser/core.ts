import trmrk from '../trmrk';
import { NullOrUndef } from '../trmrk/core';

export const defaultLongPressTimeoutMills = 400;
export const defaultFastAnimationDurationMillis = 100;
export const defaultAnimationDurationMillis = 500;
export const defaultSlowAnimationDurationMillis = 1000;

export const absUriRegex = () => () =>
  /^[\w\-_]+\:\/\/([\w\-_]+\.?)+(\:[0-9]+)?(\/[\w\-\?\.\+_&=#,]*)*$/g;

export const getNewUri = (
  query?: URLSearchParams | NullOrUndef,
  hash?: string | NullOrUndef,
  path?: string | NullOrUndef,
  host?: string | NullOrUndef,
  preserveQueryDelim?: boolean | NullOrUndef
) => {
  const queryStr = query?.toString();

  const partsArr = [host, path].filter((part) =>
    trmrk.isNonEmptyStr(part, true)
  );

  let newUri = partsArr.join('/');

  if (preserveQueryDelim || trmrk.isNonEmptyStr(queryStr, true)) {
    newUri = [newUri, queryStr].join('?');
  }

  if (trmrk.isNonEmptyStr(hash)) {
    newUri += hash;
  }

  return newUri;
};

export const getRelUri = (
  queryParams: URLSearchParams,
  queryParamsTransformer: (query: URLSearchParams) => void,
  hashTransformer?:
    | ((hash?: string | NullOrUndef) => string | NullOrUndef)
    | NullOrUndef,
  pathTransformer?:
    | ((hash?: string | NullOrUndef) => string | NullOrUndef)
    | NullOrUndef,
  preserveQueryDelim?: boolean | NullOrUndef
) => {
  queryParamsTransformer(queryParams);
  hashTransformer ??= (hash) => hash;

  pathTransformer ??= (path) => {
    if (typeof path === 'string') {
      if (path.startsWith('/')) {
        path = path.substring(1);
      }

      if (path.endsWith('/')) {
        path = path.substring(0, path.length - 1);
      }
    }

    return path;
  };

  const hash = hashTransformer(location.hash);
  const path = pathTransformer(location.pathname);

  const newUri = getNewUri(queryParams, hash, path, null, preserveQueryDelim);
  return newUri;
};
