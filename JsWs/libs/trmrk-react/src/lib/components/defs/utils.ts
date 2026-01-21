import React from "react";

import { NullOrUndef, withValIf, actWithValIf } from "@/src/trmrk/core";

export const withRefValIf = <TVal>(
  refObj: React.RefObject<TVal | NullOrUndef>,
  convertor: (input: TVal) => TVal | NullOrUndef,
  defaultValueFactory?: ((input: TVal | NullOrUndef) => TVal) | NullOrUndef,
  defaultInputPredicate?:
    | ((input: TVal | NullOrUndef) => boolean)
    | NullOrUndef,
) => {
  refObj.current = withValIf(
    refObj.current,
    convertor,
    defaultValueFactory,
    defaultInputPredicate,
  );
};

export const clearRefVal = <TVal>(
  refObj: React.RefObject<TVal | NullOrUndef>,
  callback: (input: TVal) => void,
  defaultValueFactory?: ((input: TVal | NullOrUndef) => TVal) | NullOrUndef,
  defaultInputPredicate?:
    | ((input: TVal | NullOrUndef) => boolean)
    | NullOrUndef,
) => {
  actWithValIf(
    refObj.current,
    callback,
    defaultValueFactory,
    defaultInputPredicate,
  );

  refObj.current = null;
};
