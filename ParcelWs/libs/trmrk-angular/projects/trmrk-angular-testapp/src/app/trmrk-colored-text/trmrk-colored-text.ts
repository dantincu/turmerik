import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrmrkAppPage } from 'trmrk-angular';

@Component({
  selector: 'trmrk-colored-text',
  imports: [TrmrkAppPage, CommonModule],
  templateUrl: './trmrk-colored-text.html',
  styleUrl: './trmrk-colored-text.scss',
})
export class TrmrkColoredText {}
