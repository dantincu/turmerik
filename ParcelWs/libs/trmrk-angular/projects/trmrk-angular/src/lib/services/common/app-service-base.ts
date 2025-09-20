import { Injectable, Inject, EventEmitter, OnDestroy } from '@angular/core';

import { NullOrUndef } from '../../../trmrk/core';

import { AppStateServiceBase } from './app-state-service-base';
import { AppConfigCore } from './app-config';
import { injectionTokens } from '../dependency-injection/injection-tokens';

export interface RegisterModalArgsCore {
  modalId: number;
  modalType: string;
}

export interface RegisterModalArgs extends RegisterModalArgsCore {}

export interface RegisteredModal extends RegisterModalArgsCore {}

export interface GetAppObjectKeyOpts {
  delims?: string[] | NullOrUndef;
  includeAppName?: boolean | NullOrUndef;
}

export const AppObjectKeyDelims = {
  default: ['[', ']'],
  windowShowDirectoryPicker: ['_', '_'],
};

@Injectable()
export class AppServiceBase implements OnDestroy {
  public onCloseModal = new EventEmitter<number>();
  public onCloseAllModals = new EventEmitter<void>();
  public registeredModals: RegisteredModal[] = [];

  constructor(
    @Inject(injectionTokens.appConfig) public appConfig: AppConfigCore,
    public appStateService: AppStateServiceBase
  ) {
    if (!appConfig.requiresSetup) {
      appStateService.setupOk.next(true);
    }
  }

  ngOnDestroy(): void {}

  getAppObjectKey(parts: string[], opts?: GetAppObjectKeyOpts | NullOrUndef) {
    opts ??= {};
    opts.delims ??= AppObjectKeyDelims.default;
    opts.includeAppName ??= true;

    const appObjectKey = [...(opts.includeAppName ? [this.appStateService.appName] : []), ...parts]
      .map((part) => [opts.delims![0], part, opts.delims![1]].join(''))
      .join('');
    return appObjectKey;
  }

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
