import { NullOrUndef } from '../../../core';
import { TrmrkValueFactory, TrmrkFormRow, NodeHtml } from '../../forms/types';
import { TrmrkFormHelper } from '../../forms/trmrkForm';

export interface MacroCore {
  key: string;
  name?: string | NullOrUndef;
  isEnabled?: boolean | NullOrUndef;
}

export interface Macro<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> extends MacroCore {
  factory: TrmrkValueFactory<
    MacroArgs<THtml, TFormHelper>,
    string | MacroOutput
  >;
}

export interface MacroSection<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> extends MacroCore {
  macros?: Macro<THtml, TFormHelper>[] | NullOrUndef;
  subSections?: MacroSection<THtml, TFormHelper>[] | NullOrUndef;
}

export interface TextSelection {
  startPos: number;
  length: number;
}

export interface MacroResult {
  replace: TextReplacement[];
  selection?: TextSelection | NullOrUndef;
  autoClose?: boolean | NullOrUndef;
}

export interface MacroArgs<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> {
  allText: string;
  selection: TextSelection;
  form: TFormHelper;
  formEl: HTMLElement;
  resolve: (result: MacroResult) => void;
}

export interface TextReplacement {
  newText: string;
  selection: TextSelection;
}

export interface MacroOutput {
  result?: MacroResult | NullOrUndef;
  form?: TrmrkFormRow[] | NullOrUndef;
}
