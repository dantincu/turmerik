import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { maxSafeInteger } from '../../../../trmrk/math';

@Component({
  selector: 'trmrk-list-slice-selector',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './trmrk-list-slice-selector.html',
  styleUrl: './trmrk-list-slice-selector.scss',
})
export class TrmrkListSliceSelector {
  maxSafeInteger = maxSafeInteger;

  isExpanded = false;

  expandedToggled() {
    this.isExpanded = !this.isExpanded;
  }
}
