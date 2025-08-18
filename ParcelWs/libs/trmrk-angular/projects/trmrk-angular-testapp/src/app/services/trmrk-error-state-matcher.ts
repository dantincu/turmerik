import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';

export class TrmrkErrorStateMatcher implements ErrorStateMatcher {
  constructor(private hasErrorPredicate: () => boolean) {}

  isErrorState(
    _: FormControl | null,
    _1: FormGroupDirective | NgForm | null
  ): boolean {
    return this.hasErrorPredicate();
  }
}
