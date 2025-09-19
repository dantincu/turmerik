import { Injectable } from '@angular/core';

import { ModalIdService } from './modal-id-service';
import { AppStateServiceBase } from './app-state-service-base';
import { ModalService } from './modal-service';

@Injectable({
  providedIn: 'root',
})
export class ModalServiceFactory {
  constructor(
    private modalIdService: ModalIdService,
    private appStateService: AppStateServiceBase
  ) {}

  create() {
    return new ModalService(this.modalIdService, this.appStateService);
  }
}
