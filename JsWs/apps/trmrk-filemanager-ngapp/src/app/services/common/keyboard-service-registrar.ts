import { Injectable } from '@angular/core';

import { KeyboardServiceRegistrarBase } from '../../../trmrk-angular/services/common/keyboard-service-registrar-base';

@Injectable()
export class KeyboardServiceRegistrar extends KeyboardServiceRegistrarBase {
  override getSetupArgs() {
    const args = super.getSetupArgs();
    return args;
  }

  override getSetupArgsFactoryOpts() {
    const opts = super.getSetupArgsFactoryOpts();
    return opts;
  }
}
