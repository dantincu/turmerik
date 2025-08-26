import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

import {
  MatAutocompleteModule,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';

import { MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { TrmrkAppPage } from 'trmrk-angular';

import { TrmrkSpinner } from '../USER-CODE/forms/trmrk-spinner/trmrk-spinner';

@Component({
  selector: 'trmrk-form-fields-page',
  imports: [
    TrmrkAppPage,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatIconButton,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckbox,
    MatSelectModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatChipsModule,
    TrmrkSpinner,
  ],
  templateUrl: './trmrk-form-fields-page.html',
  styleUrl: './trmrk-form-fields-page.scss',
})
export class TrmrkFormFieldsPage {
  @ViewChild('foodAutocompleteInput_1', { read: MatAutocompleteTrigger })
  foodAutocompleteTrigger_1!: MatAutocompleteTrigger;

  @ViewChild('foodAutocompleteInput', { read: MatAutocompleteTrigger })
  foodAutocompleteTrigger!: MatAutocompleteTrigger;

  @ViewChild('foodAutocompleteInput1', { read: MatAutocompleteTrigger })
  foodAutocompleteTrigger1!: MatAutocompleteTrigger;

  foodsComboboxDisplayFn(option: any): string {
    return option?.viewValue || '';
  }

  foodOptionsSeparatorKeysCodes: number[] = [ENTER, COMMA];
  foodAutocompleteCtrl = new FormControl('');
  foodAutocompleteCtrl1 = new FormControl('');

  constructor() {
    this.foodAutocompleteCtrl.valueChanges.subscribe((_) => {});
  }

  selectFoodOption(
    event: MatOptionSelectionChange<any>,
    option: any,
    cssSelectorSuffix = ''
  ) {
    if (event.isUserInput) {
      let scrollTop: number | null = null;

      let panel = document.querySelector(
        `.trmrk-food-autocomplete${cssSelectorSuffix}`
      );

      if (panel) {
        scrollTop = panel.scrollTop;
      }

      setTimeout(() => {
        const foodAutocompleteTrigger =
          cssSelectorSuffix === ''
            ? this.foodAutocompleteTrigger
            : this.foodAutocompleteTrigger1;

        foodAutocompleteTrigger.openPanel();

        panel = document.querySelector(
          `.trmrk-food-autocomplete${cssSelectorSuffix}`
        );

        if (panel) {
          panel.scrollTo({
            top: scrollTop!,
          });
        }
      });
    }
  }

  selectFoodAutocompleteDoneClick(autoCompleteTriggerIdx = 0) {
    const foodAutocompleteTrigger =
      autoCompleteTriggerIdx === -1
        ? this.foodAutocompleteTrigger_1
        : autoCompleteTriggerIdx === 0
        ? this.foodAutocompleteTrigger
        : this.foodAutocompleteTrigger1;

    if (foodAutocompleteTrigger.panelOpen) {
      setTimeout(() => {
        foodAutocompleteTrigger.closePanel();
      });
    }
  }
}
