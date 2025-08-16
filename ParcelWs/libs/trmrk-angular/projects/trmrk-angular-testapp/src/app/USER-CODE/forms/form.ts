import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { NullOrUndef } from '../../../trmrk/core';

import { NodeHtml, NodeHtmlInfo } from '../../../trmrk/USER-CODE/forms/types';

export const hasRawHtml = (htmlInfo: NodeHtml | NullOrUndef) =>
  (htmlInfo ?? null) !== null &&
  ('string' === typeof htmlInfo || (htmlInfo!.raw ?? null) !== null);

export const hasHtmlTemplate = (htmlInfo: NodeHtml | NullOrUndef) =>
  ((htmlInfo as NodeHtmlInfo)?.idnf ?? null) !== null;

export const getHtmlTemplateName = (htmlInfo: NodeHtml | NullOrUndef) =>
  (htmlInfo as NodeHtmlInfo)?.idnf ?? null;

export const getRawHtml = (htmlInfo: NodeHtml | NullOrUndef) => {
  let htmlStr: string | null = null;

  if ((htmlInfo ?? null) !== null) {
    if ('string' === typeof htmlInfo) {
      htmlStr = htmlInfo;
    } else {
      htmlStr = htmlInfo!.raw ?? null;
    }
  }

  return htmlStr;
};

export const getSafeHtml = (
  htmlInfo: NodeHtml | NullOrUndef,
  sanitizer: DomSanitizer
) => {
  const rawHtml = getRawHtml(htmlInfo);
  let safeHtml: SafeHtml | null = null;

  if (rawHtml !== null) {
    safeHtml = sanitizer.bypassSecurityTrustHtml(rawHtml);
  }

  return safeHtml;
};
