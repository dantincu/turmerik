import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { TrmrkDialog } from '../../../common/trmrk-dialog/trmrk-dialog';

import {
  TrmrkDialogData,
  mergeDialogData,
  TrmrkDialogComponentDataCore,
} from '../../../../services/common/trmrk-dialog';

import { TrmrkEditAppThemeDialogService } from '../../../../services/pages/trmrk-edit-app-theme-dialog-service';

import { NullOrUndef } from '../../../../../trmrk/core';

export interface TrmrkEditAppThemeData extends TrmrkDialogComponentDataCore {
  id?: number | NullOrUndef;
  name: string;
}

@Component({
  selector: 'trmrk-edit-app-theme-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, TrmrkDialog],
  templateUrl: './trmrk-edit-app-theme-dialog.html',
  styleUrl: './trmrk-edit-app-theme-dialog.scss',
})
export class TrmrkEditAppThemeDialog {
  mergeDialogData = mergeDialogData;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: TrmrkDialogData<TrmrkEditAppThemeData>,
    public dialogRef: MatDialogRef<any>,
    public trmrkEditAppThemeDialogService: TrmrkEditAppThemeDialogService
  ) {}
}
