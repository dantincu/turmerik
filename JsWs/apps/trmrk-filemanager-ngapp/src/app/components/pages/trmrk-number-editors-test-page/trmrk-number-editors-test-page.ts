import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { TrmrkAppPage } from '../../../../trmrk-angular/components/common/trmrk-app-page/trmrk-app-page';
import { TrmrkHorizStrip } from '../../../../trmrk-angular/components/common/trmrk-horiz-strip/trmrk-horiz-strip';
import { TrmrkNumberInputValue } from '../../../../trmrk-angular/components/common/trmrk-number-editor/trmrk-number-editor';
import { TrmrkMatNumberInput } from '../../../../trmrk-angular/components/common/trmrk-mat-number-input/trmrk-mat-number-input';
import { TrmrkShortStringEditor } from '../../../../trmrk-angular/components/common/trmrk-short-string-editor/trmrk-short-string-editor';
import { TrmrkMatRgbInput } from '../../../../trmrk-angular/components/common/trmrk-mat-rgb-input/trmrk-mat-rgb-input';
import { TrmrkMatDateTimeInput } from '../../../../trmrk-angular/components/common/trmrk-mat-date-time-input/trmrk-mat-date-time-input';
import { TrmrkRgbInputValue } from '../../../../trmrk-angular/components/common/trmrk-rgb-editor/trmrk-rgb-editor';
import { TrmrkDateTimeInputValue } from '../../../../trmrk-angular/components/common/trmrk-date-time-editor/trmrk-date-time-editor';

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
    TrmrkMatRgbInput,
    TrmrkMatDateTimeInput,
  ],
  templateUrl: './trmrk-number-editors-test-page.html',
  styleUrl: './trmrk-number-editors-test-page.scss',
})
export class TrmrkNumberEditorsTestPage {
  matNumberInput1Value: TrmrkNumberInputValue = {
    number: 12345.678,
  };

  matNumberInput2Value: TrmrkNumberInputValue = {};

  matRgbInput1Value: TrmrkRgbInputValue = { text: '#1234' };

  matRgbInput2Value: TrmrkRgbInputValue = { text: '#123' };

  matDateTimeInput1Value: TrmrkRgbInputValue = {};

  matNumberInput1ValueChanged(value: TrmrkNumberInputValue) {
    // this.matNumberInput1Value = value;
  }

  matNumberInput2ValueChanged(value: TrmrkNumberInputValue) {
    // this.matNumberInput2Value = value;
  }

  matRgbInput1ValueChanged(value: TrmrkRgbInputValue) {
    // this.matRgbInput1Value = value;
  }

  matRgbInput2ValueChanged(value: TrmrkRgbInputValue) {
    // this.matRgbInput2Value = value;
  }

  matDateTimeInput1ValueChanged(value: TrmrkDateTimeInputValue) {
    // this.matDateTimeInput1Value = value;
  }
}
