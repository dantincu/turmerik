import { VoidOrAny } from '../../../core';

import {
  MacroCore,
  TextMacro,
  MacroSectionCore,
  TextMacroSection,
  ItemsMacroSection,
  ItemsMacro,
} from './types';

import { NodeHtml } from '../../forms/types';
import { TrmrkFormHelper } from '../../forms/trmrkForm';

import { Script, ScriptsFolder, ScriptsRootFolder } from '../scripts/types';

import {
  ScriptsContainer,
  ScriptsFilterCallback,
  ScriptsManagerBase,
} from '../scripts/ScriptsManager';

export type MacroRegistrarCallbackCore<
  TMacro extends MacroCore,
  TMacroSection extends MacroSectionCore<
    TMacro,
    TMacroSection,
    THtml,
    TFormHelper
  >,
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> = (macros: (TMacroSection | TMacro)[]) => void | Promise<VoidOrAny>;

export type TextMacroRegistrarCallback<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> = MacroRegistrarCallbackCore<TextMacro, TextMacroSection, THtml, TFormHelper>;

export type ItemsMacroRegistrarCallback<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> = MacroRegistrarCallbackCore<
  ItemsMacro,
  ItemsMacroSection,
  THtml,
  TFormHelper
>;

export const isMacroSection = (macro: MacroCore) =>
  !!(macro as TextMacro).factory;

export class MacroCallbacksRegistrar<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> {
  titleMacros: TextMacroRegistrarCallback<THtml, TFormHelper>[] = [];
  contentMacros: TextMacroRegistrarCallback<THtml, TFormHelper>[] = [];
  itemsMacros: ItemsMacroRegistrarCallback<THtml, TFormHelper>[] = [];
}

export type RegisterMacroCallbacksFunc<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> = (registrar: MacroCallbacksRegistrar<THtml, TFormHelper>) => VoidOrAny;

export type RegisterMacroCallbacksScript<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> = Script<RegisterMacroCallbacksFunc<THtml, TFormHelper>>;

export type RegisterMacroCallbacksScriptsFolder<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> = ScriptsFolder<RegisterMacroCallbacksFunc<THtml, TFormHelper>>;

export type RegisterMacroCallbacksScriptsRootFolder<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> = ScriptsRootFolder<RegisterMacroCallbacksFunc<THtml, TFormHelper>>;

export type RegisterMacroCallbacksScriptsContainer<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> = ScriptsContainer<RegisterMacroCallbacksFunc<THtml, TFormHelper>>;

export type RegisterMacroCallbacksScriptsFilterCallback<
  TScriptsManager extends ScriptsManagerBase<
    RegisterMacroCallbacksFunc<THtml, TFormHelper>
  >,
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> = ScriptsFilterCallback<
  RegisterMacroCallbacksFunc<THtml, TFormHelper>,
  TScriptsManager
>;
