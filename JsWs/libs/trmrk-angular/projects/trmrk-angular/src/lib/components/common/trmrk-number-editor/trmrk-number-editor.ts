import { Component, Input, SimpleChanges } from '@angular/core';

import { NullOrUndef } from '../../../../trmrk/core';

import { whenChanged } from '../../../services/common/simpleChanges';
import { TrmrkShortStringEditor } from '../trmrk-short-string-editor/trmrk-short-string-editor';

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
  if ((value.number ?? value.text) !== null) {
    value = numOrTextToTrmrkNumberInputValue(value.number, value.text);
  } else {
    value = { text: '' };
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

  return value;
};

interface TrmrkNumberEditorDigit {
  id: number;
  value: number;
}

@Component({
  selector: 'trmrk-number-editor',
  standalone: true,
  imports: [TrmrkShortStringEditor],
  templateUrl: './trmrk-number-editor.html',
  styleUrls: ['./trmrk-number-editor.scss'],
})
export class TrmrkNumberEditor {
  @Input() trmrkValue?: TrmrkNumberInputValue | NullOrUndef;
  @Input() trmrkMin?: number | NullOrUndef;
  @Input() trmrkMax?: number | NullOrUndef;
  @Input() trmrkStep?: number | NullOrUndef;
  @Input() trmrkRequired?: boolean | NullOrUndef;

  minValue = defaultValues.min!;
  maxValue = defaultValues.max!;
  step = defaultValues.step!;
  required = defaultValues.required!;

  hasError = false;
  errorMessage = '';

  decimalPointIndex = -1;
  digits: TrmrkNumberEditorDigit[] = [];
  focusedDigitIndex = -1;
  isPlacingDecimalPoint = false;
  value: TrmrkNumberInputValue;
  valueStr = '';

  private maxAllowedDecimals = 0;

  constructor() {
    this.value = this.getDefaultValue();
    this.updateValueStr();
  }

  ngOnChanges(changes: SimpleChanges): void {
    whenChanged(
      changes,
      () => this.trmrkValue,
      () => {
        this.value = normalizeTrmrkNumberInputValue(this.trmrkValue ?? this.getDefaultValue());
        this.updateValueStr();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkMin,
      () => {
        this.minValue = this.trmrkMin ?? defaultValues.min!;
        this.updateValueStr();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkMax,
      () => {
        this.maxValue = this.trmrkMax ?? defaultValues.max!;
        this.updateValueStr();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkStep,
      () => {
        this.step = this.trmrkStep ?? defaultValues.step!;
        this.updateValueStr();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkRequired,
      () => {
        this.required = this.trmrkRequired ?? defaultValues.required!;
        this.updateValueStr();
      }
    );
  }

  updateValue() {}

  updateValueStr() {
    this.valueStr = this.value.text ?? '';

    if (this.minValue < 0) {
      if (this.value.number! >= 0) {
        this.valueStr = '+' + this.valueStr;
      }
    }
  }

  getDefaultValue(): TrmrkNumberInputValue {
    return { ...defaultValues.value! };
  }
}
