import { Component, Inject, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';

import { NullOrUndef, VoidOrAny } from '../../../../trmrk/core';
import { getVarName } from '../../../../trmrk/Reflection/core';
import { getNumberDigits } from '../../../../trmrk/math';

import { ModalService } from '../../../services/common/modal-service';
import { ModalServiceFactory } from '../../../services/common/modal-service-factory';
import { AppStateServiceBase } from '../../../services/common/app-state-service-base';
import { AppServiceBase } from '../../../services/common/app-service-base';
import { TrmrkDialog } from '../trmrk-dialog/trmrk-dialog';
import { TrmrkHorizStrip } from '../trmrk-horiz-strip/trmrk-horiz-strip';
import { TrmrkNumberEditor } from '../trmrk-number-editor/trmrk-number-editor';

import {
  TrmrkDialogData,
  mergeDialogData,
  TrmrkDialogComponentDataCore,
} from '../../../services/common/trmrk-dialog';

export interface TrmrkNumberEditorModalDialogData extends TrmrkDialogComponentDataCore {
  value?: TrmrkNumberInputValue | NullOrUndef;
  valueSubmitted: (value: TrmrkNumberInputValue) => VoidOrAny;
  min?: number | NullOrUndef;
  max?: number | NullOrUndef;
  step?: number | NullOrUndef;
  required?: boolean | NullOrUndef;
}

export interface TrmrkNumberInputValue {
  text?: string | NullOrUndef;
  number?: number | NullOrUndef;
  digits?: number[] | NullOrUndef;
  decPtIdxLtlNdn?: number | NullOrUndef;
  isNegative?: boolean | NullOrUndef;
}

export const normalizeTrmrkNumberInputValue = (value: TrmrkNumberInputValue) => {
  if ((value.number ?? value.text) !== null) {
    value = numOrTextToTrmrkNumberInputValue(value.number, value.text);
  } else if ((value.digits ?? null) !== null) {
    value = digitsToTrmrkNumberInputValue(value.digits!, value.decPtIdxLtlNdn, value.isNegative);
  } else {
    value = { digits: [] };
  }

  return value;
};

export const numOrTextToTrmrkNumberInputValue = (
  number?: number | NullOrUndef,
  text?: string | NullOrUndef
) => {
  number ??= Number(text);

  const value: TrmrkNumberInputValue = {
    text: String(number),
    number: number,
  };

  value.isNegative = value.text!.startsWith('-');

  if (value.isNegative) {
    value.text = value.text!.substring(1);
  }

  value.digits = [...value.text!.replace('.', '')].map((ch) => Number(ch));
  value.decPtIdxLtlNdn = value.text!.indexOf('.') - (value.isNegative ? 1 : 0);
  value.decPtIdxLtlNdn = value.decPtIdxLtlNdn >= 0 ? value.decPtIdxLtlNdn : null;
  return value;
};

export const digitsToTrmrkNumberInputValue = (
  digits: number[],
  decPtIdxLtlNdn?: number | NullOrUndef,
  isNegative?: boolean | NullOrUndef
) => {
  const value: TrmrkNumberInputValue = { digits, decPtIdxLtlNdn };
  let digitsStr = value.digits!.map((d) => d.toString()).join('');
  const decPtIdx = value.decPtIdxLtlNdn!;

  if ((decPtIdx ?? null) !== null && decPtIdx >= 0) {
    digitsStr = digitsStr.slice(0, decPtIdx) + '.' + digitsStr.slice(decPtIdx, digitsStr.length);

    if (digitsStr.endsWith('.')) {
      digitsStr = digitsStr + '0';
    }

    if (digitsStr.startsWith('.')) {
      digitsStr = '0' + digitsStr;
    }
  }

  if (isNegative) {
    digitsStr = '-' + digitsStr;
  }

  value.number = Number(digitsStr);
  return value;
};

interface TrmrkNumberEditorDigit {
  id: number;
  value: number;
}

@Component({
  selector: 'trmrk-number-editor-modal-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    TrmrkDialog,
    TrmrkHorizStrip,
    TrmrkNumberEditor,
  ],
  templateUrl: './trmrk-number-editor-modal-dialog.html',
  styleUrl: './trmrk-number-editor-modal-dialog.scss',
})
export class TrmrkNumberEditorModalDialog implements OnDestroy {
  mergeDialogData = mergeDialogData;
  modalId: number;

  hasError = false;
  errorMessage = '';

  decimalPointIndex = -1;
  digits: TrmrkNumberEditorDigit[] = [];
  focusedDigitIndex = -1;
  isPlacingDecimalPoint = false;
  value: TrmrkNumberInputValue;
  dialogData: TrmrkNumberEditorModalDialogData;

  @ViewChild('fakeNumberInput') fakeNumberInput!: ElementRef<HTMLInputElement>;

  private modalService: ModalService;
  private modalOpenedSubscription;

  private _nextDigitId = 1;
  private maxAllowedDecimals = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: TrmrkDialogData<TrmrkNumberEditorModalDialogData>,
    public dialogRef: MatDialogRef<any>,
    private appStateService: AppStateServiceBase,
    private appService: AppServiceBase,
    private modalServiceFactory: ModalServiceFactory,
    private hostEl: ElementRef
  ) {
    this.fakeNumberInputKeyPressed = this.fakeNumberInputKeyPressed.bind(this);
    this.fakeNumberInputKeyDown = this.fakeNumberInputKeyDown.bind(this);

    this.modalOpenedSubscription = dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => {
        this.focusNextDigit(1);
      });
    });

    this.modalService = modalServiceFactory.create();

    this.modalService.setup({
      hostEl: () => hostEl.nativeElement,
      modalType: getVarName(() => TrmrkNumberEditorModalDialog),
      data: this.data.data,
      dialogRef,
    });

    this.modalId = this.modalService.modalId;
    this.dialogData = this.data.data;
    this.value = this.dialogData.value!;
    this.digits = this.getDigitsFromNumberInputValue();

    if (!this.digits.length) {
      this.insertDigit(0);
    }

    this.maxAllowedDecimals = getNumberDigits(this.dialogData.step!).decimals.length;
    this.decimalPointIndex = this.value.decPtIdxLtlNdn ?? -1;

    setTimeout(() => {
      this.fakeNumberInput.nativeElement.addEventListener(
        'keypress',
        this.fakeNumberInputKeyPressed
      );

      this.fakeNumberInput.nativeElement.addEventListener('keydown', this.fakeNumberInputKeyDown);
    });
  }

  ngOnDestroy(): void {
    this.fakeNumberInput.nativeElement.removeEventListener(
      'keypress',
      this.fakeNumberInputKeyPressed
    );

    this.fakeNumberInput.nativeElement.removeEventListener('keydown', this.fakeNumberInputKeyDown);

    this.modalOpenedSubscription.unsubscribe();
    this.modalService.dispose();
  }

  doneClick() {
    this.updateNumber();

    if (!this.hasError) {
      this.data.data.valueSubmitted(this.value);
      this.appService.closeModal(this.modalId);
    }
  }

  digitClicked(symbolIndex: number) {
    if (this.isPlacingDecimalPoint) {
      this.decimalPointIndex = symbolIndex;
      this.focusDigit(symbolIndex);
      this.isPlacingDecimalPoint = false;
    } else {
      this.focusDigit(symbolIndex);
    }
  }

  decimalPointClicked() {
    if ((this.isPlacingDecimalPoint = !this.isPlacingDecimalPoint) === false) {
      this.decimalPointIndex = this.digits.length - 1;
      this.insertDigit(0);
      this.focusDigit(this.digits.length - 1);
    }
  }

  plusSignClicked() {
    this.toggleSign();
  }

  minusSignClicked() {
    this.toggleSign();
  }

  fakeNumberInputKeyPressed(event: KeyboardEvent) {
    const char = event.key;

    if (char >= '0' && char <= '9') {
      if (this.focusedDigitIndex >= 0) {
        this.digits[this.focusedDigitIndex].value = Number(char);
        this.updateNumber();
      }

      this.focusNextDigit(1);
    } else {
      switch (char) {
        case '+':
          if (this.value.isNegative) {
            this.toggleSign();
          }
          break;
        case '-':
          if ((this.dialogData.min ?? Number.MIN_SAFE_INTEGER) < 0 && !this.value.isNegative) {
            this.toggleSign();
          }
          break;
        case '.':
          if (this.decimalPointIndex > 0) {
            let newDecPointIdx = Math.max(
              this.focusedDigitIndex + 1,
              this.digits.length - this.maxAllowedDecimals
            );

            this.decimalPointIndex = newDecPointIdx;
            this.updateNumber();
            this.focusNextDigit(1);
          }

          break;
      }
    }

    this.isPlacingDecimalPoint = false;
    this.fakeNumberInput.nativeElement.value = '';
  }

  fakeNumberInputKeyDown(event: KeyboardEvent) {
    switch (event.code) {
      case 'ArrowLeft':
        this.focusNextDigit(-1);
        break;
      case 'ArrowRight':
        this.focusNextDigit(1);
        break;
      case 'ArrowUp':
        break;
      case 'ArrowDown':
        break;
      case 'Home':
        this.focusDigit(0);
        break;
      case 'End':
        this.focusDigit(this.digits.length - 1);
        break;
      case 'Delete':
        this.tryDeleteDigits(event.ctrlKey ? Number.MAX_SAFE_INTEGER : 1);
        break;
      case 'Backspace':
        if (this.focusedDigitIndex > 0) {
          this.tryDeleteDigits(event.ctrlKey ? Number.MIN_SAFE_INTEGER : -1);
        }
        break;
    }
  }

  tryDeleteDigits(digitsCount = 1) {
    if (this.digits.length) {
      let index = Math.max(0, this.focusedDigitIndex);

      if (digitsCount === Number.MAX_SAFE_INTEGER) {
        digitsCount = this.digits.length - index;
      } else if (digitsCount === Number.MIN_SAFE_INTEGER) {
        digitsCount = -index;
      }

      const isBackSpace = digitsCount < 0;

      if (isBackSpace) {
        digitsCount *= -1;
        index -= digitsCount;
      }

      this.digits.splice(index, digitsCount);

      if (this.decimalPointIndex >= 0) {
        let decimalPointIndexOffset = 0;

        if (this.decimalPointIndex > index) {
          decimalPointIndexOffset = digitsCount;
        } else {
          decimalPointIndexOffset = Math.max(0, this.decimalPointIndex - index - digitsCount + 1);
        }

        this.decimalPointIndex -= decimalPointIndexOffset;
      }

      this.updateNumber();
      this.focusDigit(index);
    }
  }

  toggleSign() {
    this.updateNumber(-this.value.number!);
  }

  updateNumber(newValue: number | null = null, updateDigits = false) {
    newValue ??= this.getNumberValue();

    this.value.number = newValue;
    this.value.isNegative = newValue < 0;

    if (updateDigits) {
      this.digits = this.getDigitsFromNumberInputValue();
    }

    this.value.digits = this.digits.map((digit) => digit.value);
    this.refreshValidation();
  }

  getNumberValue() {
    let numStr =
      (this.value.isNegative ? '-' : '') +
      this.digits!.map(
        (digit, i) =>
          (i === this.decimalPointIndex ? '.' : '') +
          (digit.value >= 0 ? digit.value.toString() : '')
      ).join('');

    const num = Number(numStr);
    return num;
  }

  getDigitsFromNumberInputValue() {
    const digits: TrmrkNumberEditorDigit[] = this.value.digits!.map((value) => ({
      value,
      id: this._nextDigitId++,
    }));

    return digits;
  }

  focusNextDigit(inc: number) {
    let nextIndex = this.focusedDigitIndex + inc;
    this.focusDigit(nextIndex);
  }

  focusDigit(digitIndex: number) {
    digitIndex = Math.max(0, Math.min(this.digits.length - 1, digitIndex));
    let digit = this.digits[digitIndex];
    this.fakeNumberInput.nativeElement.focus();

    if (digit.value >= 0) {
      if (digitIndex === 0) {
        this.insertDigit(-1, 0);
        digitIndex++;
      } else if (digitIndex === this.digits.length - 1) {
        this.insertDigit();
      }
    }

    this.focusedDigitIndex = digitIndex;
  }

  insertDigit(value = -1, index = -1) {
    const digit: TrmrkNumberEditorDigit = {
      value,
      id: this._nextDigitId++,
    };

    if (index >= 0) {
      this.digits.splice(index, 0, digit);

      if (index < this.decimalPointIndex) {
        this.decimalPointIndex++;
      }
    } else {
      this.digits.push(digit);
    }
  }

  refreshValidation() {
    if (this.dialogData.required && this.value.digits!.length === 0) {
      this.hasError = true;
      this.errorMessage = 'Value is required';
    } else if (this.value.number! < this.dialogData.min!) {
      this.hasError = true;
      this.errorMessage = `Min allowed value is ${this.dialogData.min}`;
    } else if (this.value.number! > this.dialogData.max!) {
      this.hasError = true;
      this.errorMessage = `Max allowed value is ${this.dialogData.max}`;
    } else if (
      this.decimalPointIndex > 0 &&
      this.digits.length - this.decimalPointIndex > this.maxAllowedDecimals
    ) {
      this.hasError = true;
      this.errorMessage = `Max allowed decimal places is ${this.maxAllowedDecimals}`;
    } else {
      this.hasError = false;
      this.errorMessage = '';
    }
  }
}
