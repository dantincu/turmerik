import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { TrmrkAppPage } from 'trmrk-angular';

import { TrmrkErrorStateMatcher } from '../../../services/trmrk-error-state-matcher';

@Component({
  selector: 'trmrk-forms-test-page',
  imports: [
    TrmrkAppPage,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './trmrk-forms-test-page.html',
  styleUrl: './trmrk-forms-test-page.scss',
})
export class TrmrkFormsTestPage {
  ageControl = new FormControl();
  ageControl1 = new FormControl();

  ageControlErrorMatcher = new TrmrkErrorStateMatcher(
    () => this.ageControlHasError
  );

  ageControlErrorMatcher1 = new TrmrkErrorStateMatcher(
    () => this.ageControlHasError
  );

  ageControlHasError = false;

  toggleAgeControlError() {
    this.ageControlHasError = !this.ageControlHasError;

    for (let ageControl of [this.ageControl, this.ageControl1]) {
      if (this.ageControlHasError) {
        ageControl.setErrors({ customError: true });
        ageControl.markAsTouched(); // 👈 manually mark as touched
      } else {
        ageControl.setErrors(null);
      }
    }
  }
}
