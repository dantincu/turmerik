import { Component } from '@angular/core';

import { NullOrUndef } from '../../../../trmrk/core';

export interface TrmrkNumberInputValue {
  text?: string | NullOrUndef;
  number?: number | NullOrUndef;
  digits?: number[] | NullOrUndef;
  decPtIdxLtlNdn?: number | NullOrUndef;
}

export const normalizeTrmrkNumberInputValue = (value: TrmrkNumberInputValue) => {
  if ((value.number ?? value.text) !== null) {
    value = numOrTextToTrmrkNumberInputValue(value.number, value.text);
  } else if ((value.digits ?? null) !== null) {
    value = digitsToTrmrkNumberInputValue(value.digits!, value.decPtIdxLtlNdn);
  } else {
    value = { digits: [] };
  }

  return value;
};

export const numOrTextToTrmrkNumberInputValue = (
  number?: number | NullOrUndef,
  text?: string | NullOrUndef
) => {
  const value: TrmrkNumberInputValue = {
    text: text ?? String(number),
    number: number ?? Number(text),
  };

  value.digits = [...value.text!.replace('.', '')].map((ch) => Number(ch));
  value.decPtIdxLtlNdn = value.text!.indexOf('.');
  value.decPtIdxLtlNdn = value.decPtIdxLtlNdn >= 0 ? value.decPtIdxLtlNdn : null;
  return value;
};

export const digitsToTrmrkNumberInputValue = (
  digits: number[],
  decPtIdxLtlNdn?: number | NullOrUndef
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

  value.number = Number(digitsStr);
  return value;
};

@Component({
  selector: 'trmrk-number-editor',
  imports: [],
  templateUrl: './trmrk-number-editor.html',
  styleUrl: './trmrk-number-editor.scss',
})
export class TrmrkNumberEditor {}
