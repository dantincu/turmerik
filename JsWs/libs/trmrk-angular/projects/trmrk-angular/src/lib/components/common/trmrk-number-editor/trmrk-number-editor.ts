import { Component, Input, SimpleChanges } from '@angular/core';

import { NullOrUndef } from '../../../../trmrk/core';

import { whenChanged } from '../../../services/common/simpleChanges';

export interface TrmrkNumberEditorOpts {
  value?: TrmrkNumberInputValue | NullOrUndef;
  min?: number | NullOrUndef;
  max?: number | NullOrUndef;
  step?: number | NullOrUndef;
  required?: boolean | NullOrUndef;
}

export const defaultValues = Object.freeze<TrmrkNumberEditorOpts>({
  value: Object.freeze<TrmrkNumberInputValue>({
    digits: Object.freeze([] as number[]) as number[],
  }) as TrmrkNumberInputValue,
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  step: 1,
  required: false,
}) as TrmrkNumberEditorOpts;

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
  selector: 'trmrk-number-editor',
  standalone: true,
  imports: [],
  templateUrl: './trmrk-number-editor.html',
  styleUrls: ['./trmrk-number-editor.scss'],
})
export class TrmrkNumberEditor {
  @Input() trmrkValue?: TrmrkNumberInputValue | NullOrUndef;
  @Input() trmrkMin?: number | NullOrUndef;
  @Input() trmrkMax?: number | NullOrUndef;
  @Input() trmrkStep?: number | NullOrUndef;
  @Input() trmrkRequired?: boolean | NullOrUndef;

  minValue = defaultValues.min;
  maxValue = defaultValues.max;
  step = defaultValues.step;
  required = defaultValues.required;

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
        this.minValue = this.trmrkMin ?? defaultValues.min;
        this.updateValueStr();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkMax,
      () => {
        this.maxValue = this.trmrkMax ?? defaultValues.max;
        this.updateValueStr();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkStep,
      () => {
        this.step = this.trmrkStep ?? defaultValues.step;
        this.updateValueStr();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkRequired,
      () => {
        this.required = this.trmrkRequired ?? defaultValues.required;
        this.updateValueStr();
      }
    );
  }

  updateValue() {}

  updateValueStr() {}

  getDefaultValue(): TrmrkNumberInputValue {
    return { digits: [] };
  }
}
