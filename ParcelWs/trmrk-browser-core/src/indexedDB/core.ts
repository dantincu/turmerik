export interface TrmrkDBResp<T> {
  data: T;
  cacheMatch: boolean;
  cacheError: any;
}

export type TrmrkDBRespType<T> = TrmrkDBResp<T>;
