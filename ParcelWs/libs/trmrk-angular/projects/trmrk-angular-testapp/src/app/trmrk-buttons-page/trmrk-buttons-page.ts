import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TrmrkAppPage } from 'trmrk-angular';

@Component({
  selector: 'trmrk-buttons-page',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconButton,
    MatIconModule,
    TrmrkAppPage,
  ],
  templateUrl: './trmrk-buttons-page.html',
  styleUrl: './trmrk-buttons-page.scss',
})
export class TrmrkButtonsPage {}
