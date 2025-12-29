import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { NullOrUndef } from '../../../../trmrk/core';
import { normalizeColor } from '../../../../trmrk/colors';
import { whenChanged } from '../../../services/common/simpleChanges';

import { openDialog, DialogPanelSize } from '../../../services/common/trmrk-dialog';
import { TrmrkRgbInputValue, defaultValues } from '../trmrk-rgb-editor/trmrk-rgb-editor';

import {
  TrmrkRgbEditorModalDialog,
  TrmrkRgbEditorModalDialogData,
} from '../trmrk-rgb-editor-modal-dialog/trmrk-rgb-editor-modal-dialog';

@Component({
  selector: 'trmrk-mat-rgb-input',
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
  templateUrl: './trmrk-mat-rgb-input.html',
  styleUrl: './trmrk-mat-rgb-input.scss',
})
export class TrmrkMatRgbInput implements OnDestroy, OnChanges {
  @Output() trmrkValueChanged = new EventEmitter<TrmrkRgbInputValue>();

  @Input() trmrkLabel?: string | NullOrUndef;
  @Input() trmrkValue?: TrmrkRgbInputValue | NullOrUndef;
  @Input() trmrkRequired?: boolean | NullOrUndef;
  @Input() trmrkAllowAlpha?: boolean | NullOrUndef;

  @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;

  defaultValues = defaultValues;
  value: TrmrkRgbInputValue | NullOrUndef;

  constructor(private editDialog: MatDialog) {
    this.inputChanged = this.inputChanged.bind(this);

    setTimeout(() => {
      this.inputEl.nativeElement.addEventListener('change', this.inputChanged);
    });
  }

  ngOnDestroy(): void {
    this.inputEl.nativeElement.removeEventListener('change', this.inputChanged);
  }

  ngOnChanges(changes: SimpleChanges): void {
    whenChanged(
      changes,
      () => this.trmrkValue,
      () => {
        this.value = this.trmrkValue;
      }
    );
  }

  inputChanged(event: Event) {
    let value: TrmrkRgbInputValue = {
      text: this.inputEl.nativeElement.value,
    };

    value = normalizeColor(value) ?? value;
    this.value = value;
    this.trmrkValueChanged.emit(value);
  }

  editClicked() {
    openDialog<TrmrkRgbEditorModalDialogData>({
      matDialog: this.editDialog,
      dialogComponent: TrmrkRgbEditorModalDialog,
      data: {
        data: {
          label: this.trmrkLabel,
          value: this.value,
          allowAlpha: this.trmrkAllowAlpha,
          valueSubmitted: (value: TrmrkRgbInputValue) => {
            this.value = value;
            this.trmrkValueChanged.emit(value);
          },
        },
        title: 'Edit Color',
      },
      dialogPanelSize: DialogPanelSize.Large,
    });
  }
}
