import { SimpleChanges, SimpleChange } from '@angular/core';

import { getPropName } from '../../trmrk/Reflection/core';
import { VoidOrAny } from '../../trmrk/core';

export const whenChanged = <T>(
  changes: SimpleChanges,
  propName: string | (() => T),
  callback: (value: T, change: SimpleChange) => VoidOrAny
) => {
  if ('string' !== typeof propName) {
    propName = getPropName(propName);
  }

  const change = changes[propName];

  if (change) {
    callback(change.currentValue, change);
  }
};
