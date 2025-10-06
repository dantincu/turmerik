import { Injectable } from '@angular/core';

import { KeyboardShortcutService } from '../../../trmrk-angular/services/common/keyboard-shortcut-service';
import { mapPropNamesToThemselves, PropNameWordsConvention } from '../../../trmrk/propNames';

export const keyboardShortcutKeys = mapPropNamesToThemselves(
  {
    closeAppSetupModal: '',
  },
  PropNameWordsConvention.KebabCase,
  PropNameWordsConvention.CamelCase
);

export const keyboardShortcutScopes = mapPropNamesToThemselves(
  {
    appSetupModal: '',
  },
  PropNameWordsConvention.KebabCase,
  PropNameWordsConvention.CamelCase
);

@Injectable({
  providedIn: 'root',
})
export class KeyboardServiceRegistrar {
  constructor(private keyboardShortcutService: KeyboardShortcutService) {
    this.setupKeyboardShortcuts();
  }

  setupKeyboardShortcuts() {
    this.keyboardShortcutService.setup({
      shortcuts: [
        {
          name: keyboardShortcutKeys.closeAppSetupModal,
          displayName: 'Close App Setup Modal',
          scopes: [keyboardShortcutScopes.appSetupModal],
          sequence: [{ key: 'm', ctrlKey: true }, { key: 'Escape' }],
        },
      ],
    });
  }
}
