import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { TrmrkAppBar } from 'trmrk-angular';

@Component({
  selector: 'trmrk-not-found',
  imports: [MatIconModule, MatButtonModule, TrmrkAppBar],
  templateUrl: './trmrk-not-found.html',
  styleUrl: './trmrk-not-found.scss',
})
export class NotFound {}
