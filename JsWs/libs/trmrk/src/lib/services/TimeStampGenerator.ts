import { NullOrUndef, RefLazyValue } from "../core";

import {
  moveLocalTimeToUtcDate,
  dateToDisplayStr,
  moveUtcDateToLocalTime,
} from "../date";

export abstract class TimeStampGeneratorBase {
  abstract millis(timeStamp?: Date | NullOrUndef): number;
  abstract display(timeStamp?: Date | number | NullOrUndef): string;
}

export class DefaultTimeStampGenerator extends TimeStampGeneratorBase {
  millis(timeStamp?: Date | NullOrUndef) {
    timeStamp ??= moveLocalTimeToUtcDate(new Date());
    const millis = timeStamp.getTime();
    return millis;
  }

  display(timeStamp?: Date | number | NullOrUndef) {
    if (typeof timeStamp === "number") {
      timeStamp = moveUtcDateToLocalTime(new Date(timeStamp));
    } else {
      timeStamp ??= new Date();
    }

    const displayStr = dateToDisplayStr(timeStamp);
    return displayStr;
  }
}

export const defaultTimeStampGenerator = new RefLazyValue(
  () => new DefaultTimeStampGenerator(),
);
