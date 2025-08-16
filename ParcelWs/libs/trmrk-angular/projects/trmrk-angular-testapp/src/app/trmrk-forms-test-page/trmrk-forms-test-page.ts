import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { TrmrkAppPage } from 'trmrk-angular';

@Component({
  selector: 'trmrk-forms-test-page',
  imports: [TrmrkAppPage, MatInputModule, MatFormFieldModule],
  templateUrl: './trmrk-forms-test-page.html',
  styleUrl: './trmrk-forms-test-page.scss',
})
export class TrmrkFormsTestPage {}
