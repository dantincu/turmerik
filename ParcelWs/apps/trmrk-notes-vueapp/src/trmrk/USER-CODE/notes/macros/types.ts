import { NullOrUndef } from '../../../core';
import { TrmrkValueFactory, TrmrkFormRow, NodeHtml } from '../../forms/types';
import { TrmrkFormHelper } from '../../forms/trmrkForm';

export interface MacroCore {
  key: string;
  name?: string | NullOrUndef;
  isEnabled?: boolean | NullOrUndef;
}

export interface Macro<
  TData = any,
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<TData, THtml> = TrmrkFormHelper<
    TData,
    THtml
  >
> extends MacroCore {
  factory: TrmrkValueFactory<
    MacroArgs<TData, THtml, TFormHelper>,
    string | MacroOutput
  >;
}

export interface MacroSection<
  TData = any,
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<TData, THtml> = TrmrkFormHelper<
    TData,
    THtml
  >
> extends MacroCore {
  macros?: Macro<TData, THtml, TFormHelper>[] | NullOrUndef;
  subSections?: MacroSection<TData, THtml, TFormHelper>[] | NullOrUndef;
}

export interface TextSelection {
  startPos: number;
  length: number;
}

export interface MacroResult {
  replace: TextReplacement[];
  selection?: TextSelection | NullOrUndef;
}

export interface MacroArgs<
  TData = any,
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<TData, THtml> = TrmrkFormHelper<
    TData,
    THtml
  >
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
