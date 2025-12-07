import { Component, OnDestroy, Inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { getVarName } from '../../../../trmrk/Reflection/core';
import { mapPropNamesToThemselves } from '../../../../trmrk/propNames';
import { TrmrkAppPage } from '../../../../trmrk-angular/components/common/trmrk-app-page/trmrk-app-page';
import { TrmrkHorizStrip } from '../../../../trmrk-angular/components/common/trmrk-horiz-strip/trmrk-horiz-strip';
import {
  TrmrkNumberEditor,
  TrmrkNumberInputValue,
} from '../../../../trmrk-angular/components/common/trmrk-number-editor/trmrk-number-editor';
import { TrmrkMatNumberInput } from '../../../../trmrk-angular/components/common/trmrk-mat-number-input/trmrk-mat-number-input';

import {
  openDialog,
  DialogPanelSize,
} from '../../../../trmrk-angular/services/common/trmrk-dialog';

import { AppServiceBase } from '../../../../trmrk-angular/services/common/app-service-base';
import { runOnceWhenValueIs } from '../../../../trmrk-angular/services/common/TrmrkObservable';

import { AppService } from '../../../services/common/app-service';

@Component({
  selector: 'trmrk-number-editors-test-page',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    TrmrkAppPage,
    TrmrkHorizStrip,
    TrmrkMatNumberInput,
  ],
  templateUrl: './trmrk-number-editors-test-page.html',
  styleUrl: './trmrk-number-editors-test-page.scss',
})
export class TrmrkNumberEditorsTestPage {
  matNumberInput1Value: TrmrkNumberInputValue = {
    number: 12345,
  };
}
