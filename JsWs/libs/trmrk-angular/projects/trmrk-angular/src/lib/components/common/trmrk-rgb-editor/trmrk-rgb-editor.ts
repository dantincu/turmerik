import { Component, Output, EventEmitter, Input } from '@angular/core';

import { NullOrUndef, ValidationResult } from '../../../../trmrk/core';
import { ColorCore, normalizeColor } from '../../../../trmrk/colors';

import { TrmrkNumberEditor } from '../trmrk-number-editor/trmrk-number-editor';

export interface TrmrkRgbInputValue extends ColorCore {}

export interface TrmrkRgbEditorOpts {
  label?: string | NullOrUndef;
  value?: TrmrkRgbInputValue | NullOrUndef;
  required?: boolean | NullOrUndef;
}

export const defaultValues = Object.freeze<TrmrkRgbEditorOpts>({
  value: Object.freeze<TrmrkRgbInputValue>({
    text: '',
  }) as TrmrkRgbInputValue,
  required: false,
}) as TrmrkRgbEditorOpts;

@Component({
  selector: 'trmrk-rgb-editor',
  imports: [TrmrkNumberEditor],
  templateUrl: './trmrk-rgb-editor.html',
  styleUrl: './trmrk-rgb-editor.scss',
})
export class TrmrkRgbEditor {
  @Output() trmrkValidationErrorChanged = new EventEmitter<ValidationResult>();

  @Input() trmrkLabel?: string | NullOrUndef;
  @Input() trmrkValue: TrmrkRgbInputValue | NullOrUndef;
  @Input() trmrkRequired: boolean | NullOrUndef;

  value: TrmrkRgbInputValue;
  focusInput = 0;
  blurInput = 0;

  constructor() {
    this.value = this.getDefaultValue();
  }

  updateValidation() {}

  getDefaultValue(): TrmrkRgbInputValue {
    return { ...defaultValues.value! };
  }
}
