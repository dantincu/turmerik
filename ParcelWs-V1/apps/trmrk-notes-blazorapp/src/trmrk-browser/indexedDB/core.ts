export interface TrmrkDBResp<T> {
  data: T;
  cacheMatch: boolean;
  cacheError?: any | null | undefined;
}
