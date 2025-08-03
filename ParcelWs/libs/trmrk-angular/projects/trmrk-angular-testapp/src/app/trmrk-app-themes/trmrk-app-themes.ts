import { Component } from '@angular/core';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { TrmrkAppBar } from 'trmrk-angular';

@Component({
  selector: 'app-trmrk-app-themes',
  imports: [RouterLink, MatIconModule, MatButtonModule, TrmrkAppBar],
  templateUrl: './trmrk-app-themes.html',
  styleUrl: './trmrk-app-themes.scss',
})
export class TrmrkAppThemes {}
