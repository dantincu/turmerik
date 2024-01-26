import { useState, useRef } from "react";

import { RefState } from "./core";

export const useRefState = <T>(initialValue: T) => {
  const [value, setValue] = useState(initialValue);
  const valueRef = useRef(initialValue);

  return {
    value,
    setValue,
    valueRef,
  } as RefState<T>;
};
