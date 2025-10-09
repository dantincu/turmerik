import { Injectable, Inject, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { NullOrUndef } from '../../../trmrk/core';

import { AppStateServiceBase } from './app-state-service-base';
import { DarkModeService } from './dark-mode-service';
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

export const getAppObjectKey = (
  parts: string[],
  appName?: string | NullOrUndef,
  opts?: GetAppObjectKeyOpts | NullOrUndef
) => {
  opts ??= {};
  opts.delims ??= AppObjectKeyDelims.default;
  opts.includeAppName ??= (appName ?? null) != null;

  const appObjectKey = [...(opts.includeAppName ? [appName] : []), ...parts]
    .map((part) => [opts.delims![0], part, opts.delims![1]].join(''))
    .join('');

  return appObjectKey;
};

export const extractAppObjectKeyParts = (
  appObjectKey: string,
  opts?: GetAppObjectKeyOpts | NullOrUndef
) => {
  opts ??= {};
  opts.delims ??= AppObjectKeyDelims.default;
  const retArr: string[] = [];
  let str = appObjectKey;

  while (true) {
    let idx = str.indexOf(opts.delims[0]);

    if (idx >= 0) {
      retArr.push(str.substring(0, idx));
      str = str.substring(idx + opts.delims[0].length);
      idx = str.indexOf(opts.delims[1]);

      if (idx >= 0) {
        retArr.push(str.substring(0, idx));
        str = str.substring(idx + opts.delims[1].length);
      } else {
        break;
      }
    } else {
      break;
    }
  }

  retArr.push(str);
  return retArr;
};

@Injectable()
export class AppServiceBase implements OnDestroy {
  public onCloseModal = new EventEmitter<number>();
  public onCloseAllModals = new EventEmitter<void>();
  public registeredModals: RegisteredModal[] = [];

  public onAppReset = new EventEmitter<void>();
  public onAppCacheDeleted = new EventEmitter<void>();

  private appResetSubscription: Subscription;

  constructor(
    @Inject(injectionTokens.appConfig) public appConfig: AppConfigCore,
    public appStateService: AppStateServiceBase,
    private darkModeService: DarkModeService
  ) {
    this.appResetSubscription = this.onAppReset.subscribe(() => {
      this.darkModeService.revertDarkModeToDefault();
    });

    if (!appConfig.requiresSetup) {
      appStateService.setupOk.next(true);
    }
  }

  ngOnDestroy(): void {
    this.appResetSubscription.unsubscribe();
  }

  getAppObjectKey(parts: string[], opts?: GetAppObjectKeyOpts | NullOrUndef) {
    const appObjectKey = getAppObjectKey(
      parts,
      opts?.includeAppName ? this.appStateService.appName : null,
      opts
    );
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
