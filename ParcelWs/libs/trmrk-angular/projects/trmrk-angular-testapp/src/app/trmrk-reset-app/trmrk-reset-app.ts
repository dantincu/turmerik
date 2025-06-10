import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { TrmrkLoading } from 'trmrk-angular';

@Component({
  selector: 'app-trmrk-reset-app',
  imports: [TrmrkLoading, RouterLink, MatIconModule],
  templateUrl: './trmrk-reset-app.html',
  styleUrl: './trmrk-reset-app.scss',
})
export class TrmrkResetApp {}
