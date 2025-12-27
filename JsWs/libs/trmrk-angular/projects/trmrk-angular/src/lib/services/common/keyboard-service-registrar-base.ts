import { Injectable } from '@angular/core';

import { mapPropNamesToThemselves, PropNameWordsConvention } from '../../../trmrk/propNames';

import {
  KeyboardShortcutService,
  KeyboardShortcutServiceSetupArgs,
} from '../../../trmrk-angular/services/common/keyboard-shortcut-service';

import { TrmrkObservable } from '../../../trmrk-angular/services/common/TrmrkObservable';
import { NullOrUndef } from '../../../trmrk/core';

export const keyboardShortcutKeys = mapPropNamesToThemselves(
  {
    closeAppSetupModal: '',
    closeEditColorModal: '',
    colorEditorFocusRedInput: '',
    colorEditorFocusGreenInput: '',
    colorEditorFocusBlueInput: '',
    colorEditorFocusAlphaInput: '',
  },
  PropNameWordsConvention.KebabCase,
  PropNameWordsConvention.CamelCase
);

export const keyboardShortcutScopes = mapPropNamesToThemselves(
  {
    appSetupModal: '',
    editColorModal: '',
    colorEditor: '',
  },
  PropNameWordsConvention.KebabCase,
  PropNameWordsConvention.CamelCase
);

export interface KeyboardServiceSetupArgsFactoryAddModalShortcutsOpts {
  close?: boolean | NullOrUndef;
}

export interface KeyboardServiceSetupArgsFactoryAddShortcutsOpts {
  setupModal?: KeyboardServiceSetupArgsFactoryAddModalShortcutsOpts | NullOrUndef;
  editColorModal?: KeyboardServiceSetupArgsFactoryAddModalShortcutsOpts | NullOrUndef;
  colorEditor?: boolean | NullOrUndef;
}

export interface KeyboardServiceSetupArgsFactoryOpts {
  addShortcuts?: KeyboardServiceSetupArgsFactoryAddShortcutsOpts | NullOrUndef;
}

@Injectable()
export abstract class KeyboardServiceRegistrarBase {
  public shortcutsReady = new TrmrkObservable<boolean>(false);

  constructor(private keyboardShortcutService: KeyboardShortcutService) {
    this.setupKeyboardShortcuts();
  }

  getSetupArgsFactoryOpts() {
    const opts: KeyboardServiceSetupArgsFactoryOpts = {
      addShortcuts: {
        setupModal: { close: true },
        editColorModal: { close: true },
        colorEditor: true,
      },
    };

    return opts;
  }

  getSetupArgs() {
    const opts = this.getSetupArgsFactoryOpts();
    const addShortcuts = opts.addShortcuts ?? {};

    const args: KeyboardShortcutServiceSetupArgs = {
      shortcuts: [
        ...[
          addShortcuts.setupModal?.close
            ? [
                keyboardShortcutKeys.closeAppSetupModal,
                'Close App Setup Modal',
                keyboardShortcutScopes.appSetupModal,
              ]
            : [],
          addShortcuts.editColorModal?.close
            ? [
                keyboardShortcutKeys.closeEditColorModal,
                'Close Edit Modal',
                keyboardShortcutScopes.editColorModal,
              ]
            : [],
        ]
          .filter((arr) => arr.length)
          .map((arr) => ({
            name: arr[0],
            displayName: arr[1],
            scopes: [arr[2]],
            sequence: [{ key: 'm', ctrlKey: true }, { key: 'Escape' }],
          })),
        ...(addShortcuts.colorEditor
          ? [
              ['Red', keyboardShortcutKeys.colorEditorFocusRedInput],
              ['Green', keyboardShortcutKeys.colorEditorFocusGreenInput],
              ['Blue', keyboardShortcutKeys.colorEditorFocusBlueInput],
              ['Alpha', keyboardShortcutKeys.colorEditorFocusAlphaInput],
            ].map((arr) => ({
              name: arr[1],
              displayName: `Focus Color Modal ${arr[0]} Input`,
              scopes: [keyboardShortcutScopes.colorEditor],
              sequence: [{ key: arr[0][0].toLocaleLowerCase() }],
            }))
          : []),
      ],
    };

    return args;
  }

  async setupKeyboardShortcuts() {
    const args = this.getSetupArgs();
    await this.keyboardShortcutService.setup(args);
    this.shortcutsReady.next(true);
  }
}
