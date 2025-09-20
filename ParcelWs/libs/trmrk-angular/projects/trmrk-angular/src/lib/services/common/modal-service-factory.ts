import { Injectable, Inject } from '@angular/core';

import { ModalIdService } from './modal-id-service';
import { AppServiceBase } from './app-service-base';
import { ModalService } from './modal-service';

@Injectable({
  providedIn: 'root',
})
export class ModalServiceFactory {
  constructor(private modalIdService: ModalIdService, private appService: AppServiceBase) {}

  create() {
    return new ModalService(this.modalIdService, this.appService);
  }
}
