import { MatButtonAppearance } from '@angular/material/button';
import { MatFormFieldAppearance } from '@angular/material/form-field';

import { NullOrUndef } from '../../../../trmrk/core';

export interface AppearanceCore {
  useNativeControl?: boolean | NullOrUndef;
  useNativeAltControl?: boolean | NullOrUndef;
}

export interface FormFieldAppearance extends AppearanceCore {
  matFormFieldAppearance?: MatFormFieldAppearance | NullOrUndef;
}

export interface ButtonFormFieldAppearance extends FormFieldAppearance {
  matButtonAppearance?: MatButtonAppearance | NullOrUndef;
}

export interface ComboboxFormFieldAppearance extends FormFieldAppearance {}
