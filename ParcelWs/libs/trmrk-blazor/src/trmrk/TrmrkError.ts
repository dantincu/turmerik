export interface TrmrkError extends Error {
  allowsRetry?: boolean | null | undefined;
  showPageRefreshOption?: boolean | null | undefined;
}
