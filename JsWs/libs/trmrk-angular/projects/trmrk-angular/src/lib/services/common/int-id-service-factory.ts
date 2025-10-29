import { Injectable } from '@angular/core';

import { IntIdService } from './int-id-service';

@Injectable()
export class IntIdServiceFactory {
  create() {
    const instance = new IntIdService();
    return instance;
  }
}
