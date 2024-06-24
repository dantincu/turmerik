import React from "react";

import { Kvp, toMap } from "../../../../trmrk/core";
import { getWebStorageKeys } from "../../../../trmrk-browser/domUtils/core";

export interface ViewLocalStoragePageProps {}

export const serializeLocalStorage = () => {
  const keysArr = getWebStorageKeys(localStorage);
  keysArr.sort();

  const jsonObjArr = keysArr.map(key => {
    let value = localStorage.getItem(key);

    let jsonValue = value as any;

    try {
      jsonValue = JSON.parse(jsonValue);
    } catch (err) {
      jsonValue = value;
    }

    const retKvp: Kvp<string, any> = {
      key: key,
      value: jsonValue
    };

    return retKvp;
  });

  const jsonObj = toMap(jsonObjArr);
  const jsonStr = JSON.stringify(jsonObj, null, "  ");
  
  return jsonStr;
}

export default function ViewLocalStoragePage(props: ViewLocalStoragePageProps) {
  const [ jsonStr, setJsonStr ] = React.useState<string | null>(null);

  const onClearClick = () => {
    localStorage.clear();
    setJsonStr(null);
  }

  React.useEffect(() => {
    if (!jsonStr) {
      const newJsonStrVal = serializeLocalStorage();
      setJsonStr(newJsonStrVal);
    }
  }, [jsonStr]);

  return (<div className="trmrk-view-local-storage-page">
    <div><button onClick={onClearClick}>Clear</button></div>
    <pre>{ jsonStr }</pre>
  </div>);
}
