import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  OnDestroy,
} from '@angular/core';

import { MatCheckbox } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';

import { NullOrUndef, ValidationResult } from '../../../../trmrk/core';
import { ColorCore, normalizeColor } from '../../../../trmrk/colors';

import { KeyboardShortcutService } from '../../../services/common/keyboard-shortcut-service';
import { ComponentIdService } from '../../../services/common/component-id-service';
import { runOnceWhenValueIs } from '../../../services/common/TrmrkObservable';

import {
  keyboardShortcutKeys,
  keyboardShortcutScopes,
  KeyboardServiceRegistrarBase,
} from '../../../services/common/keyboard-service-registrar-base';

import { whenChanged } from '../../../services/common/simpleChanges';

import {
  TrmrkNumberEditor,
  TrmrkNumberInputValue,
  defaultValues as numberDefaultValues,
} from '../trmrk-number-editor/trmrk-number-editor';

import { FocusedCharKeyDownEvent } from '../trmrk-short-string-editor/trmrk-short-string-editor';

export interface TrmrkRgbInputValue extends ColorCore {}

export interface TrmrkRgbEditorOpts {
  label?: string | NullOrUndef;
  value?: TrmrkRgbInputValue | NullOrUndef;
  allowAlpha?: boolean | NullOrUndef;
}

export const defaultValues = Object.freeze<TrmrkRgbEditorOpts>({
  value: null,
}) as TrmrkRgbEditorOpts;

@Component({
  selector: 'trmrk-rgb-editor',
  imports: [MatCheckbox, TrmrkNumberEditor],
  templateUrl: './trmrk-rgb-editor.html',
  styleUrl: './trmrk-rgb-editor.scss',
})
export class TrmrkRgbEditor implements OnChanges, OnDestroy {
  @Output() trmrkValidationErrorChanged = new EventEmitter<ValidationResult>();

  @Input() trmrkLabel?: string | NullOrUndef;
  @Input() trmrkValue: TrmrkRgbInputValue | NullOrUndef;
  @Input() trmrkAllowAlpha?: boolean | NullOrUndef;
  @Input() trmrkFocusInput = 0;
  @Input() trmrkBlurInput = 0;

  @ViewChild('redInput', { read: TrmrkNumberEditor }) redInput!: TrmrkNumberEditor;
  @ViewChild('greenInput', { read: TrmrkNumberEditor }) greenInput!: TrmrkNumberEditor;
  @ViewChild('blueInput', { read: TrmrkNumberEditor }) blueInput!: TrmrkNumberEditor;
  @ViewChild('alphaInput', { read: TrmrkNumberEditor }) alphaInput!: TrmrkNumberEditor;

  id: number;
  value: TrmrkRgbInputValue | null;
  hexValue: string | null = null;
  rgbaValue: string | null = null;
  hexValueIsChecked = true;
  rgbaValueIsChecked = false;

  redInputValue = { ...numberDefaultValues.value };
  greenInputValue = { ...numberDefaultValues.value };
  blueInputValue = { ...numberDefaultValues.value };
  alphaInputValue = { ...numberDefaultValues.value };

  latestRedInputValue = { ...numberDefaultValues.value };
  latestGreenInputValue = { ...numberDefaultValues.value };
  latestBlueInputValue = { ...numberDefaultValues.value };
  latestAlphaInputValue = { ...numberDefaultValues.value };

  hasError = false;

  focusRedInput = 0;
  blurRedInput = 0;

  focusGreenInput = 0;
  blurGreenInput = 0;

  focusBlueInput = 0;
  blurBlueInput = 0;

  focusAlphaInput = 0;
  blurAlphaInput = 0;
  hideAlphaInput = 1;

  private keyboardShortcutSubscriptions: Subscription[] = [];

  constructor(
    private componentIdService: ComponentIdService,
    private keyboardShortcutService: KeyboardShortcutService,
    private keyboardServiceRegistrar: KeyboardServiceRegistrarBase
  ) {
    this.id = componentIdService.getNextId();
    this.value = this.getDefaultValue();
    this.setupKeyboardShortcuts();
  }

  ngOnDestroy(): void {
    this.keyboardShortcutService.unregisterAndUnsubscribeFromScopes(
      this.id,
      this.keyboardShortcutSubscriptions
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    whenChanged(
      changes,
      () => this.trmrkFocusInput,
      () => {
        if (this.trmrkFocusInput) {
          this.focusRedInput++;
        } else {
          this.focusRedInput = 0;
        }

        this.focusGreenInput = 0;
        this.focusBlueInput = 0;
        this.focusAlphaInput = 0;
      }
    );

    whenChanged(
      changes,
      () => this.trmrkBlurInput,
      () => {
        if (this.trmrkBlurInput) {
          this.blurRedInput++;
          this.blurGreenInput++;
          this.blurBlueInput++;
          this.blurAlphaInput++;
        } else {
          this.blurRedInput = 0;
          this.blurGreenInput = 0;
          this.blurBlueInput = 0;
          this.blurAlphaInput = 0;
        }
      }
    );

    whenChanged(
      changes,
      () => this.trmrkValue,
      () => {
        this.updateValue(normalizeColor(this.trmrkValue) ?? null);
        this.updateValueComponents();
      }
    );
  }

  inputFocusUpdated(isFocused: boolean, inputCode: string) {
    if (isFocused) {
      switch (inputCode) {
        case 'R':
          this.blurGreenInput++;
          this.blurBlueInput++;
          this.blurAlphaInput++;
          break;
        case 'G':
          this.blurRedInput++;
          this.blurBlueInput++;
          this.blurAlphaInput++;
          break;
        case 'B':
          this.blurRedInput++;
          this.blurGreenInput++;
          this.blurAlphaInput++;
          break;
        case 'A':
          this.blurRedInput++;
          this.blurGreenInput++;
          this.blurBlueInput++;
          break;
      }
    }
  }

  inputKeyDown(event: FocusedCharKeyDownEvent, inputCode: string) {
    if (['Enter', 'Tab'].indexOf(event.srcEvt.key) >= 0) {
      const focusPrevInput = event.srcEvt.shiftKey;

      switch (inputCode) {
        case 'R':
          if (focusPrevInput) {
            if (this.hideAlphaInput === 0) {
              this.focusAlphaInput++;
            } else {
              this.focusBlueInput++;
            }
          } else {
            this.focusGreenInput++;
          }
          break;
        case 'G':
          if (focusPrevInput) {
            this.focusRedInput++;
          } else {
            this.focusBlueInput++;
          }
          break;
        case 'B':
          if (focusPrevInput) {
            this.focusGreenInput++;
          } else {
            if (event.srcEvt.ctrlKey) {
              if (this.trmrkAllowAlpha ?? true) {
                this.toggleAlphaInput(this.hideAlphaInput > 0);

                if (this.hideAlphaInput === 0) {
                  this.focusAlphaInput++;
                }
              }
            } else {
              if (this.hideAlphaInput === 0 && (this.trmrkAllowAlpha ?? true)) {
                this.focusAlphaInput++;
              } else {
                this.focusRedInput++;
              }
            }
          }
          break;
        case 'A':
          if (focusPrevInput) {
            this.focusBlueInput++;
          } else {
            this.focusRedInput++;
          }
          break;
      }
    }
  }

  inputValueChanged(newValue: TrmrkNumberInputValue, inputCode: string) {
    setTimeout(() => {
      switch (inputCode) {
        case 'R':
          this.latestRedInputValue = newValue;
          break;
        case 'G':
          this.latestGreenInputValue = newValue;
          break;
        case 'B':
          this.latestBlueInputValue = newValue;
          break;
        case 'A':
          this.latestAlphaInputValue = newValue;
          break;
      }

      this.updateValueFromLatest();
      this.refreshValidation();
    });
  }

  alphaInputToggled(show: boolean) {
    this.toggleAlphaInput(show);
  }

  setupKeyboardShortcuts() {
    return runOnceWhenValueIs(this.keyboardServiceRegistrar.shortcutsReady, true, () => {
      this.keyboardShortcutSubscriptions.push(
        ...this.keyboardShortcutService.registerAndSubscribeToScopes(
          {
            componentId: this.id,
            considerShortcutPredicate: () => true,
          },
          {
            [keyboardShortcutScopes.colorEditor]: {
              [keyboardShortcutKeys.colorEditorFocusRedInput]: () => {
                this.blurGreenInput++;
                this.blurBlueInput++;
                this.blurAlphaInput++;
                this.focusRedInput++;
              },
              [keyboardShortcutKeys.colorEditorFocusGreenInput]: () => {
                this.blurRedInput++;
                this.blurBlueInput++;
                this.blurAlphaInput++;
                this.focusGreenInput++;
              },
              [keyboardShortcutKeys.colorEditorFocusBlueInput]: () => {
                this.blurRedInput++;
                this.blurGreenInput++;
                this.blurAlphaInput++;
                this.focusBlueInput++;
              },
              [keyboardShortcutKeys.colorEditorFocusAlphaInput]: () => {
                if (this.hideAlphaInput === 0 && (this.trmrkAllowAlpha ?? true)) {
                  this.blurRedInput++;
                  this.blurGreenInput++;
                  this.blurBlueInput++;
                  this.focusAlphaInput++;
                }
              },
            },
          }
        )
      );
    });
  }

  toggleAlphaInput(show: boolean) {
    this.hideAlphaInput = show ? 0 : 1;

    if (show) {
      this.focusAlphaInput++;
    }

    this.updateValueFromLatest();

    setTimeout(() => {
      this.refreshValidation();
    });
  }

  updateValueFromLatest() {
    const valuesArr = [
      this.latestRedInputValue,
      this.latestGreenInputValue,
      this.latestBlueInputValue,
    ];

    if (this.hideAlphaInput === 0) {
      valuesArr.push(this.latestAlphaInputValue);
    }

    this.updateValue(
      normalizeColor({
        bytes: valuesArr.map((value) => value.number!),
      }) ?? null
    );
  }

  updateValue(value: TrmrkRgbInputValue | null) {
    this.value = value;
    this.hexValue = value?.hexStr ?? null;
    this.rgbaValue = value?.rgbaStr ?? null;
  }

  updateValueComponents() {
    if (this.value?.bytes) {
      this.redInputValue = {
        number: this.value.bytes[0],
      };

      this.greenInputValue = {
        number: this.value.bytes[1],
      };

      this.blueInputValue = {
        number: this.value.bytes[2],
      };

      this.alphaInputValue = {
        number: this.value.bytes[3],
      };
    } else {
      this.redInputValue = { ...numberDefaultValues.value };
      this.greenInputValue = { ...numberDefaultValues.value };
      this.blueInputValue = { ...numberDefaultValues.value };
      this.alphaInputValue = { ...numberDefaultValues.value };
    }

    this.latestRedInputValue = { ...this.redInputValue };
    this.latestGreenInputValue = { ...this.greenInputValue };
    this.latestBlueInputValue = { ...this.blueInputValue };
    this.latestAlphaInputValue = { ...this.alphaInputValue };

    this.refreshValidation();
  }

  refreshValidation(update = false) {
    if (update) {
      this.redInput?.updateValidation();
      this.greenInput?.updateValidation();
      this.blueInput?.updateValidation();

      if (!this.hideAlphaInput) {
        this.alphaInput?.updateValidation();
      }
    }

    this.hasError = [
      this.redInput?.hasError ?? true,
      this.greenInput?.hasError ?? true,
      this.blueInput?.hasError ?? true,
      this.hideAlphaInput > 0 ? false : this.alphaInput?.hasError ?? true,
    ].reduce((hasError1, hasError2) => hasError1 || hasError2);

    this.trmrkValidationErrorChanged.emit({
      hasError: this.hasError,
    });

    return !this.hasError;
  }

  getDefaultValue(): TrmrkRgbInputValue | null {
    return defaultValues.value ? { ...defaultValues.value! } : null;
  }
}
