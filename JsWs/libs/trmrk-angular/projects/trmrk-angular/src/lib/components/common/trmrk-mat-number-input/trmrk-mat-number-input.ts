import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { NullOrUndef } from '../../../../trmrk/core';
import { whenChanged } from '../../../services/common/simpleChanges';

import { openDialog, DialogPanelSize } from '../../../services/common/trmrk-dialog';

import {
  TrmrkNumberEditorModalDialog,
  TrmrkNumberEditorModalDialogData,
  TrmrkNumberInputValue,
  normalizeTrmrkNumberInputValue,
} from '../trmrk-number-editor-modal-dialog/trmrk-number-editor-modal-dialog';

@Component({
  selector: 'trmrk-mat-number-input',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatIconButton,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatDialogModule,
  ],
  templateUrl: './trmrk-mat-number-input.html',
  styleUrl: './trmrk-mat-number-input.scss',
})
export class TrmrkMatNumberInput implements OnChanges {
  @Input() trmrkLabel?: string | NullOrUndef;
  @Input() trmrkValue?: TrmrkNumberInputValue | NullOrUndef;
  @Input() trmrkMin?: number | NullOrUndef;
  @Input() trmrkMax?: number | NullOrUndef;
  @Input() trmrkStep?: number | NullOrUndef;
  @Input() trmrkRequired?: boolean | NullOrUndef;

  dfLabel = '';
  dfMinValue = Number.MIN_SAFE_INTEGER;
  dfMaxValue = Number.MAX_SAFE_INTEGER;
  dfStep = 1;
  dfRequired = false;

  value: TrmrkNumberInputValue;
  label = this.dfLabel;
  minValue = this.dfMinValue;
  maxValue = this.dfMaxValue;
  step = this.dfStep;
  required = this.dfRequired;

  constructor(private editDialog: MatDialog) {
    this.value = this.getDefaultValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    whenChanged(
      changes,
      () => this.trmrkValue,
      () => {
        if ((this.trmrkValue ?? null) !== null) {
          this.value = normalizeTrmrkNumberInputValue(this.trmrkValue!);
        } else {
          this.value = this.getDefaultValue();
        }
      }
    );

    whenChanged(
      changes,
      () => this.trmrkLabel,
      () => {
        this.label = this.trmrkLabel ?? this.dfLabel;
      }
    );

    whenChanged(
      changes,
      () => this.trmrkMin,
      () => {
        this.minValue = this.trmrkMin ?? this.dfMinValue;
      }
    );

    whenChanged(
      changes,
      () => this.trmrkMax,
      () => {
        this.maxValue = this.trmrkMax ?? this.dfMaxValue;
      }
    );

    whenChanged(
      changes,
      () => this.trmrkStep,
      () => {
        this.step = this.trmrkStep ?? this.dfStep;
      }
    );

    whenChanged(
      changes,
      () => this.trmrkRequired,
      () => {
        this.required = this.trmrkRequired ?? this.dfRequired;
      }
    );
  }

  editClicked() {
    openDialog<TrmrkNumberEditorModalDialogData>({
      matDialog: this.editDialog,
      dialogComponent: TrmrkNumberEditorModalDialog,
      data: {
        data: {
          value: { ...this.value },
          min: this.minValue,
          max: this.maxValue,
          step: this.step,
          required: this.required,
          valueSubmitted: (value: TrmrkNumberInputValue) => {
            this.value = value;
          },
        },
        title: this.trmrkLabel,
      },
    });
  }

  getDefaultValue(): TrmrkNumberInputValue {
    return { digits: [] };
  }
}
