import {
  Component,
  Inject,
  Input,
  TemplateRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { whenChanged } from '../../../services/simpleChanges';
import { TrmrkHorizStrip } from '../trmrk-horiz-strip/trmrk-horiz-strip';
import { NullOrUndef } from '../../../../trmrk/core';
import { TrmrkDialogData } from '../../../services/trmrk-dialog';

@Component({
  selector: 'trmrk-dialog',
  imports: [
    TrmrkHorizStrip,
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './trmrk-dialog.html',
  styleUrl: './trmrk-dialog.scss',
})
export class TrmrkDialog<TData = any> implements OnChanges {
  @Input() trmrkData?: TrmrkDialogData<TData> | NullOrUndef;
  @Input() trmrkHeaderTemplate: TemplateRef<any> | NullOrUndef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TrmrkDialogData<TData>,
    public dialogRef: MatDialogRef<any>
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    whenChanged(
      changes,
      () => this.trmrkData,
      (data) =>
        (this.data = { ...data!, dialogRef: data!.dialogRef ?? this.dialogRef })
    );
  }

  closeModalClick(_: MouseEvent) {
    this.data.dialogRef?.close();
  }
}
