import { Injectable, Inject } from '@angular/core';

import { IntIdServiceFactory } from './int-id-service-factory';
import { IntIdService } from './int-id-service';

import { injectionTokens } from '../dependency-injection/injection-tokens';

@Injectable({
  providedIn: 'root',
})
export class ModalIdService {
  private intIdService: IntIdService;

  constructor(
    @Inject(injectionTokens.intIdServiceFactory) intIdServiceFactory: IntIdServiceFactory
  ) {
    this.intIdService = intIdServiceFactory.create();
  }

  public getNextId() {
    return this.intIdService.getNextId();
  }
}
