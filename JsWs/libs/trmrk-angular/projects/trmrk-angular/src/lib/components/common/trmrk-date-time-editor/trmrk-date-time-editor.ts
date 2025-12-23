import { Component, Output, EventEmitter, Input } from '@angular/core';

import { NullOrUndef, ValidationResult } from '../../../../trmrk/core';

import {
  TimeStamp,
  TimeStampFormat,
  TimeStampFormatKind,
  timeStampToStr,
  timeStampFromStr,
} from '../../../../trmrk/date-string';

export interface TrmrkDateTimeInputValue extends TimeStampFormat {}

export interface TrmrkDateTimeEditorOpts {
  label?: string | NullOrUndef;
  value?: TrmrkDateTimeInputValue | NullOrUndef;
  required?: boolean | NullOrUndef;
}

export const defaultValues = Object.freeze<TrmrkDateTimeEditorOpts>({
  value: Object.freeze<TrmrkDateTimeInputValue>({
    text: '',
  }) as TrmrkDateTimeInputValue,
  required: false,
}) as TrmrkDateTimeEditorOpts;

@Component({
  selector: 'trmrk-date-time-editor',
  imports: [],
  templateUrl: './trmrk-date-time-editor.html',
  styleUrl: './trmrk-date-time-editor.scss',
})
export class TrmrkDateTimeEditor {
  @Output() trmrkValidationErrorChanged = new EventEmitter<ValidationResult>();

  @Input() trmrkLabel?: string | NullOrUndef;
  @Input() trmrkValue: TrmrkDateTimeInputValue | NullOrUndef;
  @Input() trmrkRequired: boolean | NullOrUndef;

  value: TrmrkDateTimeInputValue;
  focusInput = 0;
  blurInput = 0;

  constructor() {
    this.value = this.getDefaultValue();
  }

  updateValidation() {}

  getDefaultValue(): TrmrkDateTimeInputValue {
    return { ...defaultValues.value! };
  }
}
