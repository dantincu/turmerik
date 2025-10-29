import { Injectable } from '@angular/core';

import { NullOrUndef } from '../../../trmrk/core';

@Injectable()
export abstract class TimeStampGeneratorBase {
  abstract millis(timeStamp?: Date | NullOrUndef): number;
  abstract display(timeStamp?: Date | number | NullOrUndef): string;
}
