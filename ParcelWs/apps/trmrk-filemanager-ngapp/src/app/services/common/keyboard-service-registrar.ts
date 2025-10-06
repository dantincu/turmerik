import { Injectable } from '@angular/core';

import { KeyboardShortcutService } from '../../../trmrk-angular/services/common/keyboard-shortcut-service';

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
          name: 'close-app-setup-modal',
          displayName: 'Close App Setup Modal',
          scopes: ['app-setup-modal'],
          sequence: [{ key: 'm', ctrlKey: true }, { key: 'Escape' }],
        },
      ],
    });
  }
}
