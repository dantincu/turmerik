import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

import { NullOrUndef, ValidationResult } from '../../../../trmrk/core';
import { ColorCore, normalizeColor } from '../../../../trmrk/colors';

import { whenChanged } from '../../../services/common/simpleChanges';
import { TrmrkNumberEditor } from '../trmrk-number-editor/trmrk-number-editor';

import { FocusedCharKeyPressEvent } from '../trmrk-short-string-editor/trmrk-short-string-editor';

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
export class TrmrkRgbEditor implements OnChanges {
  @Output() trmrkValidationErrorChanged = new EventEmitter<ValidationResult>();

  @Input() trmrkLabel?: string | NullOrUndef;
  @Input() trmrkValue: TrmrkRgbInputValue | NullOrUndef;
  @Input() trmrkRequired: boolean | NullOrUndef;
  @Input() trmrkFocusInput = 0;
  @Input() trmrkBlurInput = 0;

  value: TrmrkRgbInputValue;
  focusRedInput = 0;
  blurRedInput = 0;

  focusGreenInput = 0;
  blurGreenInput = 0;

  focusBlueInput = 0;
  blurBlueInput = 0;

  focusAlphaInput = 0;
  blurAlphaInput = 0;

  constructor() {
    this.value = this.getDefaultValue();
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

  inputKeyPressed(event: FocusedCharKeyPressEvent, inputCode: string) {
    if (!event.hasNextFocusedChar) {
      switch (inputCode) {
        case 'R':
          this.focusGreenInput++;
          break;
        case 'G':
          this.focusBlueInput++;
          break;
        case 'B':
          this.focusAlphaInput++;
          break;
        case 'A':
          break;
      }
    }
  }

  updateValidation() {}

  getDefaultValue(): TrmrkRgbInputValue {
    return { ...defaultValues.value! };
  }
}
