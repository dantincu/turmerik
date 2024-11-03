import { URLSearchParamsInit, ParamKeyValuePair } from "react-router-dom";

import trmrk from "../../../trmrk";

export const extractParams = (
  params: URLSearchParams,
  callback:
    | ((paramsArr: ParamKeyValuePair[]) => ParamKeyValuePair[])
    | null
    | undefined = null
) => {
  let retArr: ParamKeyValuePair[] = [];

  for (let key of params.keys()) {
    retArr.push([key, params.get(key)!]);
  }

  if (callback) {
    retArr = callback(retArr);
  }

  return retArr;
};

export const removekeys = (paramsArr: ParamKeyValuePair[], keysArr: string[]) =>
  trmrk.removeAll(paramsArr, (item) => keysArr.indexOf(item[0]) >= 0);
