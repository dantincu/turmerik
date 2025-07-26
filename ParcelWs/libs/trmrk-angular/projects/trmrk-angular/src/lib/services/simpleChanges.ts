import { SimpleChanges } from '@angular/core';

import { getPropName } from '../../trmrk/Reflection/core';

export const whenChanged = <T>(
  changes: SimpleChanges,
  propName: string | (() => T),
  callback: (value: T) => any | void | null | undefined
) => {
  if ('string' !== typeof propName) {
    propName = getPropName(propName);
  }

  const change = changes[propName];

  if (change) {
    callback(change.currentValue);
  }
};
