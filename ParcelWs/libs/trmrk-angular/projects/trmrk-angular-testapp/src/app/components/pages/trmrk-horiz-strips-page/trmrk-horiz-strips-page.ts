import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';

import { TrmrkAppPage } from 'trmrk-angular';
import { TrmrkPanelListItem, trmrkTreeEventHandlers } from 'trmrk-angular';
import { TrmrkHorizStrip, TrmrkHorizStripType } from 'trmrk-angular';
import { TrmrkThinHorizStrip } from 'trmrk-angular';

import { getNextIdx } from '../../../../trmrk/math';

import { companies } from '../../../services/companies';

@Component({
  selector: 'trmrk-horiz-strips-page',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatIconButton,
    TrmrkHorizStrip,
    TrmrkAppPage,
    TrmrkPanelListItem,
    TrmrkThinHorizStrip,
  ],
  templateUrl: './trmrk-horiz-strips-page.html',
  styleUrl: './trmrk-horiz-strips-page.scss',
})
export class TrmrkHorizStripsPage {
  TrmrkHorizStripType = TrmrkHorizStripType;
  companies = [...companies];

  getCompaniesTextFromCoords(
    loopSizes: number[],
    loopIdxes: number[],
    wordsCount: number
  ) {
    const nextIdx = getNextIdx(loopSizes, loopIdxes);
    const wordsArr = this.companies.slice(nextIdx, nextIdx + wordsCount);
    const retText = wordsArr.join(' | ');
    return retText;
  }

  getCompaniesText(nextIdx: number, wordsCount: number) {
    const wordsArr = this.companies.slice(nextIdx, wordsCount);
    const retText = wordsArr.join(' | ');
    return retText;
  }
}
