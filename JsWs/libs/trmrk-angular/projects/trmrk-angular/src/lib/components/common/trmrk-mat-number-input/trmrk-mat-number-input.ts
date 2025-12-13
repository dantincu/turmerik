import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
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
} from '../trmrk-number-editor-modal-dialog/trmrk-number-editor-modal-dialog';

import { TrmrkNumberInputValue, defaultValues } from '../trmrk-number-editor/trmrk-number-editor';

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
export class TrmrkMatNumberInput implements OnDestroy {
  @Output() trmrkValueChanged = new EventEmitter<TrmrkNumberInputValue>();

  @Input() trmrkLabel?: string | NullOrUndef;
  @Input() trmrkValue?: TrmrkNumberInputValue | NullOrUndef;
  @Input() trmrkMin?: number | NullOrUndef;
  @Input() trmrkMax?: number | NullOrUndef;
  @Input() trmrkStep?: number | NullOrUndef;
  @Input() trmrkRequired?: boolean | NullOrUndef;

  @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;

  defaultValues = defaultValues;

  constructor(private editDialog: MatDialog) {
    this.inputChanged = this.inputChanged.bind(this);

    setTimeout(() => {
      this.inputEl.nativeElement.addEventListener('change', this.inputChanged);
    });
  }

  ngOnDestroy(): void {
    this.inputEl.nativeElement.removeEventListener('change', this.inputChanged);
  }

  inputChanged(event: Event) {
    const value: TrmrkNumberInputValue = {
      text: this.inputEl.nativeElement.value,
      number: null,
    };

    if (value.text!.length) {
      value.number = Number(value.text);
    }

    this.trmrkValueChanged.emit(value);
  }

  editClicked() {
    openDialog<TrmrkNumberEditorModalDialogData>({
      matDialog: this.editDialog,
      dialogComponent: TrmrkNumberEditorModalDialog,
      data: {
        data: {
          value: this.trmrkValue,
          min: this.trmrkMin,
          max: this.trmrkMax,
          step: this.trmrkStep,
          required: this.trmrkRequired,
          valueSubmitted: (value: TrmrkNumberInputValue) => {
            this.trmrkValueChanged.emit(value);
          },
        },
        title: this.trmrkLabel,
      },
    });
  }
}
