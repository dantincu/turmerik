import {
  Component,
  Inject,
  Input,
  TemplateRef,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenu, MatMenuTrigger } from '@angular/material/menu';

import { whenChanged } from '../../../services/common/simpleChanges';
import { TrmrkHorizStrip } from '../trmrk-horiz-strip/trmrk-horiz-strip';
import { NullOrUndef } from '../../../../trmrk/core';
import { tab_group } from '../../../assets/icons/material';

import {
  TrmrkDialogData,
  TrmrkDialogComponentDataCore,
} from '../../../services/common/trmrk-dialog';

import { AppServiceBase } from '../../../services/common/app-service-base';
import { ModalService } from '../../../services/common/modal-service';

@Component({
  selector: 'trmrk-dialog',
  imports: [
    TrmrkHorizStrip,
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './trmrk-dialog.html',
  styleUrl: './trmrk-dialog.scss',
})
export class TrmrkDialog<TData extends TrmrkDialogComponentDataCore = TrmrkDialogComponentDataCore>
  implements OnChanges, OnDestroy
{
  @Input() trmrkModalId!: number;
  @Input() trmrkData?: TrmrkDialogData<TData> | NullOrUndef;
  @Input() trmrkHeaderTemplate: TemplateRef<any> | NullOrUndef;

  @ViewChild(MatMenu) optionsMenu!: MatMenu;

  @ViewChild('optionsMenuTrigger', { read: MatMenuTrigger })
  optionsMenuTrigger!: MatMenuTrigger;

  tabGroupIcon: SafeHtml;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TrmrkDialogData<TData>,
    public dialogRef: MatDialogRef<any>,
    private domSanitizer: DomSanitizer,
    private appService: AppServiceBase
  ) {
    this.tabGroupIcon = domSanitizer.bypassSecurityTrustHtml(tab_group);

    setTimeout(() => {
      this.optionsMenuTrigger.menu = this.optionsMenu;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    whenChanged(
      changes,
      () => this.trmrkData,
      (data) => (this.data = { ...data!, dialogRef: data!.dialogRef ?? this.dialogRef })
    );
  }

  ngOnDestroy(): void {
    this.trmrkData = null;
    this.trmrkHeaderTemplate = null;
  }

  closeModalClick(_: MouseEvent) {
    this.appService.closeModal(this.trmrkModalId);
  }

  openOptionsMenuBtnClick(_: MouseEvent) {
    this.optionsMenuTrigger.openMenu();
  }
}
