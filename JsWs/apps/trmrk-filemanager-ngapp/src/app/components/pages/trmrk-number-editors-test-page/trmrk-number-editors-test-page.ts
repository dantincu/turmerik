import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { TrmrkAppPage } from '../../../../trmrk-angular/components/common/trmrk-app-page/trmrk-app-page';
import { TrmrkHorizStrip } from '../../../../trmrk-angular/components/common/trmrk-horiz-strip/trmrk-horiz-strip';
import { TrmrkNumberInputValue } from '../../../../trmrk-angular/components/common/trmrk-number-editor/trmrk-number-editor';
import { TrmrkMatNumberInput } from '../../../../trmrk-angular/components/common/trmrk-mat-number-input/trmrk-mat-number-input';
import { TrmrkShortStringEditor } from '../../../../trmrk-angular/components/common/trmrk-short-string-editor/trmrk-short-string-editor';

@Component({
  selector: 'trmrk-number-editors-test-page',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    TrmrkAppPage,
    TrmrkHorizStrip,
    TrmrkMatNumberInput,
    TrmrkShortStringEditor,
  ],
  templateUrl: './trmrk-number-editors-test-page.html',
  styleUrl: './trmrk-number-editors-test-page.scss',
})
export class TrmrkNumberEditorsTestPage {
  matNumberInput1Value: TrmrkNumberInputValue = {
    number: 1234560.789,
  };

  matNumberInput2Value: TrmrkNumberInputValue = {
    number: -1234560.789,
  };
}
