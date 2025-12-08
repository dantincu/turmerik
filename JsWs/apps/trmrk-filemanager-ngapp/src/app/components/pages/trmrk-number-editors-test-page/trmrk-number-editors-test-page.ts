import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { TrmrkAppPage } from '../../../../trmrk-angular/components/common/trmrk-app-page/trmrk-app-page';
import { TrmrkHorizStrip } from '../../../../trmrk-angular/components/common/trmrk-horiz-strip/trmrk-horiz-strip';
import { TrmrkNumberInputValue } from '../../../../trmrk-angular/components/common/trmrk-number-editor-modal-dialog/trmrk-number-editor-modal-dialog';
import { TrmrkMatNumberInput } from '../../../../trmrk-angular/components/common/trmrk-mat-number-input/trmrk-mat-number-input';

@Component({
  selector: 'trmrk-number-editors-test-page',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    TrmrkAppPage,
    TrmrkHorizStrip,
    TrmrkMatNumberInput,
  ],
  templateUrl: './trmrk-number-editors-test-page.html',
  styleUrl: './trmrk-number-editors-test-page.scss',
})
export class TrmrkNumberEditorsTestPage {
  matNumberInput1Value: TrmrkNumberInputValue = {
    number: 123456.789,
  };

  matNumberInput2Value: TrmrkNumberInputValue = {
    number: -123456.789,
  };
}
