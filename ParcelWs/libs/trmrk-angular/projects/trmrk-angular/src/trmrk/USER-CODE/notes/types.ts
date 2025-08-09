export interface ActionResponse<TResult> {
  result?: TResult | null | undefined;
  hasError?: boolean | null | undefined;
  errorTitle?: string | null | undefined;
  errorMessage?: string | null | undefined;
  errorCode?: number | null | undefined;
}
