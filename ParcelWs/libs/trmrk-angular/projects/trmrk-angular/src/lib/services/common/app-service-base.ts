import { Injectable, Inject, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AppStateServiceBase } from './app-state-service-base';
import { AppConfigCore } from './app-config';
import { injectionTokens } from '../dependency-injection/injection-tokens';

export interface RegisterModalArgsCore {
  modalId: number;
}

export interface RegisterModalArgs extends RegisterModalArgsCore {}

export interface RegisteredModal extends RegisterModalArgsCore {}

@Injectable()
export class AppServiceBase implements OnDestroy {
  public onCloseModal = new EventEmitter<number>();
  public onCloseAllModals = new EventEmitter<void>();
  private registeredModals: RegisteredModal[] = [];

  constructor(
    @Inject(injectionTokens.appConfig) public appConfig: AppConfigCore,
    public appStateService: AppStateServiceBase
  ) {
    if (!appConfig.requiresSetup) {
      appStateService.setupOk.next(true);
    }
  }

  ngOnDestroy(): void {}

  registerModal(args: RegisterModalArgs) {
    this.registeredModals.push(args);
    this.appStateService.currentModalId.next(args.modalId);
  }

  closeModal(modalId: number) {
    this.onCloseModal.emit(modalId);
    const modalIdx = this.registeredModals.findIndex((modal) => modal.modalId === modalId);

    if (modalIdx >= 0) {
      this.registeredModals.splice(modalIdx, 1);
    }
  }

  closeAllModals() {
    this.onCloseAllModals.emit();
    this.registeredModals = [];
  }
}
