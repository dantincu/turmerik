import { Injectable } from '@angular/core';

import { v4 as uuidv4 } from 'uuid';

import { uuidToBase36 } from '../../../trmrk/uuid';

import { TrmrkStrIdGeneratorBase } from './trmrk-str-id-generator-base';

@Injectable()
export class TrmrkDefaultStrIdGenerator extends TrmrkStrIdGeneratorBase {
  newId(): string {
    const uuid = uuidv4();
    const base36 = uuidToBase36(uuid);
    return base36;
  }
}
