import { RefLazyValue } from "../core";

export interface ParsedUrl {
  url: URL;
  urlStr: string;
  relUrlStr: string;
  pathSegments: string[];
}

export class UrlSerializer {
  constructor() {}

  getBaseUrl(url: string): string {
    const urlObj = new URL(url);
    return urlObj.origin;
  }

  normalizeUrl(parsedUrl: ParsedUrl): ParsedUrl {
    if (parsedUrl.pathSegments) {
      parsedUrl.url.pathname = "/" + parsedUrl.pathSegments.join("/");
    }

    parsedUrl.urlStr = parsedUrl.url.toString();

    parsedUrl.relUrlStr = parsedUrl.urlStr.substring(
      parsedUrl.url.origin.length,
    );

    return parsedUrl;
  }

  deserializeUrl(
    url: string | URL,
    base?: string | URL | undefined,
  ): ParsedUrl {
    const normalized = url instanceof URL ? url : new URL(url, base);
    const urlStr = normalized.toString();

    let retObj: ParsedUrl = {
      url: normalized,
      pathSegments: normalized.pathname.split("/").filter((c) => c.length > 0),
      urlStr: urlStr,
      relUrlStr: urlStr.substring(normalized.origin.length),
    };

    return retObj;
  }
}

export const defaultUrlSerializer = new RefLazyValue(() => new UrlSerializer());
