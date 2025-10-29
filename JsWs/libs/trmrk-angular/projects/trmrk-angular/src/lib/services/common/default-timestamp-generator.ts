import { Injectable } from '@angular/core';

import { NullOrUndef } from '../../../trmrk/core';

import {
  moveLocalTimeToUtcDate,
  dateToDisplayStr,
  moveUtcDateToLocalTime,
} from '../../../trmrk/date';

import { TimeStampGeneratorBase } from './timestamp-generator-base';

@Injectable({
  providedIn: 'root',
})
export class DefaultTimeStampGenerator extends TimeStampGeneratorBase {
  millis(timeStamp?: Date | NullOrUndef) {
    timeStamp ??= moveLocalTimeToUtcDate(new Date());
    const millis = timeStamp.getTime();
    return millis;
  }

  display(timeStamp?: Date | number | NullOrUndef) {
    if (typeof timeStamp === 'number') {
      timeStamp = moveUtcDateToLocalTime(new Date(timeStamp));
    } else {
      timeStamp ??= new Date();
    }

    const displayStr = dateToDisplayStr(timeStamp);
    return displayStr;
  }
}
