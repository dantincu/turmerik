export interface ITrmrkError<TData> {
  statusCode?: number | null | undefined;
  statusText?: string | null | undefined;
  allowsRetry?: boolean | null | undefined;
  showPageRefreshOption?: boolean | null | undefined;
  data?: TData | null | undefined;
}

export class TrmrkError<TData> extends Error implements ITrmrkError<TData> {
  statusCode?: number | null | undefined;
  statusText?: string | null | undefined;
  allowsRetry?: boolean | null | undefined;
  showPageRefreshOption?: boolean | null | undefined;
  data: TData | null | undefined;

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
