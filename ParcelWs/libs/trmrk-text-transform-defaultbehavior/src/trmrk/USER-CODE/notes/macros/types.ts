import { NullOrUndef } from '../../../core';
import { ValueFactory, FormRow } from '../../forms/types';
import { TrmrkFormHelper } from '../../forms/trmrkForm';

export interface MacroCore {
  key: string;
  name?: string | NullOrUndef;
  isEnabled?: boolean | NullOrUndef;
}

export interface Macro extends MacroCore {
  factory: ValueFactory<MacroArgs, string | TextReplacement[] | MacroOutput>;
}

export interface MacroSection extends MacroCore {
  macros?: Macro[] | NullOrUndef;
  subSections?: MacroSection[] | NullOrUndef;
}

export interface TextSelection {
  startPos: number;
  length: number;
}

export interface MacroArgs {
  allText: string;
  selection: TextSelection;
  form: TrmrkFormHelper;
  resolve: (result: TextReplacement[]) => void;
}

export interface TextReplacement {
  newText: string;
  selection: TextSelection;
}

export interface MacroOutput {
  result?: TextReplacement[] | NullOrUndef;
  form?: FormRow[] | NullOrUndef;
}
