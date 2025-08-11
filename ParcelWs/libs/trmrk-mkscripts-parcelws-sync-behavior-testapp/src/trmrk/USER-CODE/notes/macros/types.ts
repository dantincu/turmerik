import { NullOrUndef } from '../../../core';
import { ValueFactory } from '../../forms/types';

export interface MacroCore {
  key: string;
  name?: string | NullOrUndef;
  isEnabled?: boolean | NullOrUndef;
}

export interface Macro<TInput, TOutput> extends MacroCore {
  factory: ValueFactory<TInput, TOutput>;
}

export interface MacroSection<TInput, TOutput> extends MacroCore {
  macros?: Macro<TInput, TOutput>[] | NullOrUndef;
  subSections?: MacroSection<TInput, TOutput>[] | NullOrUndef;
}

export interface TextSelection {
  startPos: number;
  length: number;
}

export interface MacroInput {
  text: string;
  selection: TextSelection;
}

export interface MacroOutput extends MacroInput {}

export interface TitleMacro
  extends Macro<string, string | MacroOutput | MacroOutput[]> {}

export interface TitleMacroSection
  extends MacroSection<string, string | MacroOutput | MacroOutput[]> {}

export interface ContentMacro
  extends Macro<MacroInput, MacroOutput | MacroOutput | MacroOutput[]> {}

export interface ContentMacroSection
  extends MacroSection<MacroInput, MacroOutput | MacroOutput | MacroOutput[]> {}
