import { Component, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NullOrUndef, ValidationResult } from '../../../../trmrk/core';
import { getNumberDigits } from '../../../../trmrk/math';

import { whenChanged } from '../../../services/common/simpleChanges';
import {
  TrmrkShortStringEditor,
  CharShortPressOrLeftClickEvent,
  FocusedCharDeleteBtnShortPressOrLeftClickEvent,
  FocusedCharKeyPressEvent,
  FocusedCharInsertBtnLongPressOrRightClickEvent,
  FocusedCharInsertBtnShortPressOrLeftClickEvent,
} from '../trmrk-short-string-editor/trmrk-short-string-editor';

export interface TrmrkNumberEditorOpts {
  value?: TrmrkNumberInputValue | NullOrUndef;
  min?: number | NullOrUndef;
  max?: number | NullOrUndef;
  step?: number | NullOrUndef;
  required?: boolean | NullOrUndef;
}

export const defaultValues = Object.freeze<TrmrkNumberEditorOpts>({
  value: Object.freeze<TrmrkNumberInputValue>({
    text: '',
  }) as TrmrkNumberInputValue,
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  step: 1,
  required: false,
}) as TrmrkNumberEditorOpts;

export interface TrmrkNumberInputValue {
  text?: string | NullOrUndef;
  number?: number | NullOrUndef;
}

export const normalizeTrmrkNumberInputValue = (value: TrmrkNumberInputValue) => {
  if ((value.number ?? value.text ?? null) !== null) {
    value = numOrTextToTrmrkNumberInputValue(value.number, value.text);
  } else {
    value = { text: ' ' };
  }

  return value;
};

export const numOrTextToTrmrkNumberInputValue = (
  number?: number | NullOrUndef,
  text?: string | NullOrUndef
) => {
  number ??= Number(text);

  const value: TrmrkNumberInputValue = {
    text: isNaN(number) ? '' : String(number),
    number: number,
  };

  return value;
};

@Component({
  selector: 'trmrk-number-editor',
  standalone: true,
  imports: [CommonModule, TrmrkShortStringEditor],
  templateUrl: './trmrk-number-editor.html',
  styleUrls: ['./trmrk-number-editor.scss'],
})
export class TrmrkNumberEditor {
  @Output() trmrkValidationErrorChanged = new EventEmitter<ValidationResult>();

  @Input() trmrkValue: TrmrkNumberInputValue | NullOrUndef;
  @Input() trmrkMin: number | NullOrUndef;
  @Input() trmrkMax: number | NullOrUndef;
  @Input() trmrkStep: number | NullOrUndef;
  @Input() trmrkRequired: boolean | NullOrUndef;
  @Input() trmrkFocusInput = 0;
  @Input() trmrkBlurInput = 0;
  @Input() trmrkShowOutput: boolean | NullOrUndef;

  NaN = NaN;
  isNaN = isNaN;

  minValue = defaultValues.min!;
  maxValue = defaultValues.max!;
  step = defaultValues.step!;
  required = defaultValues.required!;
  maxAllowedIntDigits = 0;
  maxAllowedDecimals = 0;

  hasError = false;
  errorMessage = '';

  focusedCharIdx = 0;
  isPlacingDecimalPoint = false;
  value: TrmrkNumberInputValue;
  focusInput = 0;
  blurInput = 0;

  constructor() {
    this.value = this.getDefaultValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    whenChanged(
      changes,
      () => this.trmrkFocusInput,
      () => {
        this.focusInput = this.trmrkFocusInput ? ++this.focusInput : 0;
      }
    );

    whenChanged(
      changes,
      () => this.trmrkBlurInput,
      () => {
        this.blurInput = this.trmrkBlurInput ? ++this.blurInput : 0;
      }
    );

    whenChanged(
      changes,
      () => this.trmrkValue,
      () => {
        this.value = normalizeTrmrkNumberInputValue(this.trmrkValue ?? this.getDefaultValue());
        this.updateValidation();
        this.focusNextDigit(0);
      }
    );

    whenChanged(
      changes,
      () => this.trmrkMin,
      () => {
        this.minValue = this.trmrkMin ?? defaultValues.min!;
        this.updateMaxAllowedDigitsCount();
        this.updateValidation();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkMax,
      () => {
        this.maxValue = this.trmrkMax ?? defaultValues.max!;
        this.updateMaxAllowedDigitsCount();
        this.updateValidation();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkStep,
      () => {
        this.step = this.trmrkStep ?? defaultValues.step!;
        this.updateMaxAllowedDecimalsCount();
        this.updateValidation();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkRequired,
      () => {
        this.required = this.trmrkRequired ?? defaultValues.required!;
        this.updateValidation();
      }
    );
  }

  charDeleteBtnShortPressOrLeftClick(event: FocusedCharDeleteBtnShortPressOrLeftClickEvent) {
    this.value.text = event.newString;

    if (this.value.text.endsWith('.')) {
      this.value.text = this.value.text.substring(0, this.value.text.length - 1);
    }

    if (event.focusedCharIdx >= this.value.text.length) {
      this.focusNextDigit(this.value.text.length - 1);
    } else if (this.value.text[event.focusedCharIdx] === '.') {
      this.focusNextDigit(event.focusedCharIdx);
    }

    this.updateValue();
  }

  charDeleteBtnLongPressOrRightClick(event: FocusedCharDeleteBtnShortPressOrLeftClickEvent) {
    setTimeout(() => {
      this.value.text = event.newString;

      if (!this.value.text.length) {
        this.value.text = ' ';
      }

      this.updateValue();
      this.focusNextDigit(this.focusedCharIdx - 1);
    });
  }

  charBackspaceBtnShortPressOrLeftClick(event: FocusedCharDeleteBtnShortPressOrLeftClickEvent) {
    this.value.text = event.newString;

    if (this.value.text.endsWith('.')) {
      this.value.text = this.value.text.substring(0, this.value.text.length - 1);
    }

    if (event.focusedCharIdx >= this.value.text.length) {
      this.focusNextDigit(this.value.text.length - 1);
    } else if (this.value.text[event.focusedCharIdx] === '.') {
      this.focusNextDigit(event.focusedCharIdx);
    }

    this.updateValue();
  }

  charBackspaceBtnLongPressOrRightClick(event: FocusedCharDeleteBtnShortPressOrLeftClickEvent) {
    setTimeout(() => {
      this.value.text = event.newString;
      this.updateValue();
      this.blurInput++;
      this.focusNextDigit(0);
    });
  }

  charInsertBtnShortPressOrLeftClick(event: FocusedCharInsertBtnShortPressOrLeftClickEvent) {
    this.value.text = event.newString;
    this.updateValue();

    if (event.focusedChar !== ' ' && event.insertAtTheEnd) {
      this.focusNextDigit(this.value.text!.length - 1);
    } else {
      this.focusNextDigit(event.focusedCharIdx);
    }
  }

  charInsertBtnLongPressOrRightClick(event: FocusedCharInsertBtnLongPressOrRightClickEvent) {
    if (event.insertAtTheEnd) {
      this.value.number = this.maxValue;
    } else {
      this.value.number = this.minValue;
    }

    this.updateTextFromValue();
    this.updateValidation();
    this.focusNextDigit(0);
  }

  charShortPressOrLeftClick(event: CharShortPressOrLeftClickEvent) {
    if (event.nextFocusedChar === ' ' || /\d/g.test(event.nextFocusedChar)) {
      this.focusNextDigit(event.nextFocusedCharIdx);
    }
  }

  inputKeyPressed(event: FocusedCharKeyPressEvent) {
    if (/\d/g.test(event.newChar)) {
      this.value.text = event.newString;
      this.updateValue();
      this.focusNextDigit(event.nextFocusedCharIdx);
    } else {
      switch (event.newChar) {
        case '.':
          this.tryMoveDecimalPlace();
          break;
        case '-':
          this.tryToggleSign();
          break;
      }
    }
  }

  doneBtnTouchStartOrMouseDown(event: MouseEvent | TouchEvent) {
    this.focusedCharIdx = -1;
  }

  moveDecimalPlaceClicked() {
    this.tryMoveDecimalPlace();
  }

  toggleSignClicked() {
    this.tryToggleSign();
  }

  getCharCssClass(chr: string, idx: number) {
    let cssClass = '';

    switch (chr) {
      case '.':
        cssClass = 'trmrk-decimal-point';
        break;
      case '+':
        cssClass = 'trmrk-plus-sign';
        break;
      case '-':
        cssClass = 'trmrk-minus-sign';
        break;
    }

    return cssClass;
  }

  updateValidation() {
    if (this.required && this.value.text!.replaceAll(' ', '').length === 0) {
      this.hasError = true;
      this.errorMessage = 'Value is required';
    } else if (isNaN(this.value.number!)) {
      this.hasError = true;
      this.errorMessage = 'Invalid number';
    } else if (this.value.number! < this.minValue) {
      this.hasError = true;
      this.errorMessage = `Min allowed value is ${this.minValue}`;
    } else if (this.value.number! > this.maxValue) {
      this.hasError = true;
      this.errorMessage = `Max allowed value is ${this.maxValue}`;
    } else if (this.getDecimalsCount() > this.maxAllowedDecimals) {
      this.hasError = true;
      this.errorMessage =
        this.maxAllowedDecimals > 0
          ? `Max allowed decimal places is ${this.maxAllowedDecimals}`
          : 'No decimal places allowed';
    } else {
      this.hasError = false;
      this.errorMessage = '';
    }

    this.trmrkValidationErrorChanged.emit({
      hasError: this.hasError,
      errorMessage: this.errorMessage,
    });
  }

  updateValue() {
    const text = this.value.text!.replaceAll(' ', '');

    if (text.length) {
      this.value.number = Number(text);
    } else {
      this.value.number = null;
    }

    this.updateValidation();
  }

  updateTextFromValue() {
    this.value.text = isNaN(this.value.number ?? NaN) ? '' : this.value.number!.toString();
  }

  updateMaxAllowedDigitsCount() {
    this.maxAllowedIntDigits = getNumberDigits(
      Math.floor(Math.max(Math.abs(this.minValue), Math.abs(this.maxValue)))
    )!.intPartDigits.length;
  }

  updateMaxAllowedDecimalsCount() {
    this.maxAllowedDecimals = getNumberDigits(this.step)!.decimals.length;
  }

  focusNextDigit(nextCharIdx: number) {
    const initialNextCharIdx = Math.max(
      [...this.value.text!].findIndex((char) => this.isFocusableChar(char)),
      nextCharIdx
    );

    nextCharIdx = initialNextCharIdx;
    let nextChar: string = this.value.text![nextCharIdx] ?? '';

    while (!this.isFocusableChar(nextChar) && nextChar.length) {
      nextChar = this.value.text![++nextCharIdx] ?? '';
    }

    if (!nextChar.length) {
      let canAddDigit = false;

      if (this.value.text!.indexOf('.') >= 0) {
        canAddDigit = this.getDecimalsCount() < this.maxAllowedDecimals;
      } else {
        canAddDigit = this.getIntDigitsCount() < this.maxAllowedIntDigits;
      }

      if (canAddDigit) {
        this.value.text += nextChar = ' ';
        nextCharIdx = this.value.text!.length - 1;
      } else {
        nextCharIdx = initialNextCharIdx - 1;
        nextChar = this.value.text![nextCharIdx] ?? '';

        while (!this.isFocusableChar(nextChar) && nextChar.length) {
          nextChar = this.value.text![--nextCharIdx] ?? '';
        }
      }
    }

    this.focusedCharIdx = nextCharIdx;

    if (nextChar.length) {
      this.focusInput++;
    } else {
      this.blurInput++;
    }
  }

  isFocusableChar(char: string) {
    const isFocusable = char === ' ' || /\d/g.test(char);
    return isFocusable;
  }

  getIntDigitsCount() {
    const decimalsCount = getNumberDigits(this.value.number)?.intPartDigits.length ?? 0;
    return decimalsCount;
  }

  getDecimalsCount() {
    const decimalsCount = getNumberDigits(this.value.number)?.decimals.length ?? 0;
    return decimalsCount;
  }

  getDefaultValue(): TrmrkNumberInputValue {
    return { ...defaultValues.value! };
  }

  tryMoveDecimalPlace() {
    if (this.maxAllowedDecimals > 0) {
      const firstDigitIndex = this.value.text!.startsWith('-') ? 1 : 0;

      if (this.focusedCharIdx >= firstDigitIndex) {
        const decPlaceIdx = this.value.text!.indexOf('.');

        const focusedCharIdxOffset = decPlaceIdx >= 0 && this.focusedCharIdx > decPlaceIdx ? 0 : 1;

        this.value.text = [...this.value.text!.replace('.', '')]
          .map((char, idx) =>
            idx === this.focusedCharIdx + focusedCharIdxOffset ? '.' + char : char
          )
          .join('');

        if (this.value.text!.indexOf('.') < 0) {
          this.value.text += '. ';
          this.focusNextDigit(this.value.text!.length - 1);
        } else {
          this.focusNextDigit(this.focusedCharIdx);
        }

        this.updateValue();
      }
    }
  }

  tryToggleSign() {
    if (this.minValue < 0) {
      this.value.number! *= -1;
      this.updateTextFromValue();
      this.updateValidation();

      if (this.value.number! > 0) {
        this.focusNextDigit(this.focusedCharIdx - 2);
      } else {
        this.focusNextDigit(this.focusedCharIdx);
      }
    }
  }
}
