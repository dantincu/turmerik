import { NullOrUndef } from './core';

export interface ITrmrkError<TData> {
  statusCode?: number | NullOrUndef;
  statusText?: string | NullOrUndef;
  allowsRetry?: boolean | NullOrUndef;
  showPageRefreshOption?: boolean | NullOrUndef;
  data?: TData | NullOrUndef;
}

export class TrmrkError<TData> extends Error implements ITrmrkError<TData> {
  statusCode?: number | NullOrUndef;
  statusText?: string | NullOrUndef;
  allowsRetry?: boolean | NullOrUndef;
  showPageRefreshOption?: boolean | NullOrUndef;
  data: TData | NullOrUndef;

  constructor(
    message?: string,
    options?: ErrorOptions | null,
    src?: ITrmrkError<TData> | null
  ) {
    super(message, options ?? undefined);

    if (src) {
      this.statusCode = src.statusCode;
      this.statusText = src.statusText;
      this.allowsRetry = src.allowsRetry;
      this.showPageRefreshOption = src.showPageRefreshOption;
      this.data = src.data;
    }
  }
}
