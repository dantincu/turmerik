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
import { timeStampFromStr } from '../../../../trmrk/date-string';
import { openDialog } from '../../../services/common/trmrk-dialog';

import {
  TrmrkDateTimeInputValue,
  defaultValues,
} from '../trmrk-date-time-editor/trmrk-date-time-editor';

import {
  TrmrkDateTimeEditorModalDialog,
  TrmrkDateTimeEditorModalDialogData,
} from '../trmrk-date-time-editor-modal-dialog/trmrk-date-time-editor-modal-dialog';

@Component({
  selector: 'trmrk-mat-date-time-input',
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
  templateUrl: './trmrk-mat-date-time-input.html',
  styleUrl: './trmrk-mat-date-time-input.scss',
})
export class TrmrkMatDateTimeInput implements OnDestroy {
  @Output() trmrkValueChanged = new EventEmitter<TrmrkDateTimeInputValue>();

  @Input() trmrkLabel?: string | NullOrUndef;
  @Input() trmrkValue?: TrmrkDateTimeInputValue | NullOrUndef;
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
    let value: TrmrkDateTimeInputValue = {
      text: this.inputEl.nativeElement.value,
    };

    value = timeStampFromStr(value);
    this.trmrkValueChanged.emit(value);
  }

  editClicked() {
    openDialog<TrmrkDateTimeEditorModalDialogData>({
      matDialog: this.editDialog,
      dialogComponent: TrmrkDateTimeEditorModalDialog,
      data: {
        data: {
          label: this.trmrkLabel,
          value: this.trmrkValue,
          required: this.trmrkRequired,
          valueSubmitted: (value: TrmrkDateTimeInputValue) => {
            this.trmrkValueChanged.emit(value);
          },
        },
        title: 'Edit Date Time',
      },
    });
  }
}
