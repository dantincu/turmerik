import { NullOrUndef } from '../../trmrk/core';

export interface TrmrkDBResp<T> {
  data: T;
  cacheMatch: boolean;
  cacheError?: any | NullOrUndef;
}

export const getIDbRequestOpenErrorMsg = (
  error: DOMException | null
): string => {
  let errorMsg: string;

  if (error) {
    errorMsg = `${error.name} - ${error.message}`;
  } else {
    errorMsg = 'Unknown error occurred while opening IndexedDB.';
  }

  return errorMsg;
};
