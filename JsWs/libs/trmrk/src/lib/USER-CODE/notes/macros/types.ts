import { NullOrUndef } from '../../../core';
import { TrmrkValueFactory, TrmrkFormRow, NodeHtml } from '../../forms/types';
import { TrmrkFormHelper } from '../../forms/trmrkForm';

export interface MacroCore {
  key: string;
  name?: string | NullOrUndef;
  isEnabled?: boolean | NullOrUndef;
}

export interface TextMacro<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> extends MacroCore {
  factory: TrmrkValueFactory<
    TextMacroArgs<THtml, TFormHelper>,
    string | TextMacroOutput
  >;
}

export interface ItemsMacro<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> extends MacroCore {
  factory: TrmrkValueFactory<
    ItemsMacroArgs<THtml, TFormHelper>,
    ItemsMacroOutput
  >;
}

export interface MacroSectionCore<
  TMacro extends MacroCore,
  TMacroSection extends MacroSectionCore<
    TMacro,
    TMacroSection,
    THtml,
    TFormHelper
  >,
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> extends MacroCore {
  macros?: TMacro[] | NullOrUndef;
  subSections?: TMacroSection[] | NullOrUndef;
}

export interface TextMacroSection<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> extends MacroSectionCore<
    TextMacro<THtml, TFormHelper>,
    TextMacroSection<THtml, TFormHelper>
  > {}

export interface ItemsMacroSection<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> extends MacroSectionCore<
    ItemsMacro<THtml, TFormHelper>,
    ItemsMacroSection<THtml, TFormHelper>
  > {}

export interface TextSelection {
  startPos: number;
  length: number;
}

export interface MacroResultCore {
  autoClose?: boolean | NullOrUndef;
}

export interface TextMacroResult extends MacroResultCore {
  replace: TextReplacement[];
  selection?: TextSelection | NullOrUndef;
}

export interface ItemsMacroResult extends MacroResultCore {}

export interface MacroArgsCore<
  TMacroResult extends MacroResultCore,
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> {
  form: TFormHelper;
  formEl: HTMLElement;
  resolve: (result: TMacroResult) => void;
}

export interface TextMacroArgs<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> extends MacroArgsCore<TextMacroResult, THtml, TFormHelper> {
  allText: string;
  selection: TextSelection;
}

export interface ItemsMacroArgs<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> extends MacroArgsCore<ItemsMacroResult, THtml, TFormHelper> {}

export interface TextReplacement {
  newText: string;
  selection: TextSelection;
}

export interface MacroOutputCore {
  form?: TrmrkFormRow[] | NullOrUndef;
}

export interface TextMacroOutput extends MacroOutputCore {
  result?: TextMacroResult | NullOrUndef;
}

export interface ItemsMacroOutput extends MacroOutputCore {}
