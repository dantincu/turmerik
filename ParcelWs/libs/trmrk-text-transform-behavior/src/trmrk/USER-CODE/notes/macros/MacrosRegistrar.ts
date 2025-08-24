import { VoidOrAny } from '../../../core';
import { TrmrkUrlPath } from '../../notes/types';

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

export interface DirPathIdnf {
  csId: string;
  path: string;
  parsedPath: TrmrkUrlPath;
}

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
> = (arg: (TMacroSection | TMacro)[]) => void | Promise<VoidOrAny>;

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

export interface TrmrkPageCore<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> {
  titleCallbacks: TextMacroRegistrarCallback<THtml, TFormHelper>[];
  contentCallbacks: TextMacroRegistrarCallback<THtml, TFormHelper>[];
  itemsCallbacks: ItemsMacroRegistrarCallback<THtml, TFormHelper>[];
}

export interface TrmrkPage<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> extends TrmrkPageCore<THtml, TFormHelper> {
  idnf: DirPathIdnf;
}

export const isMacroSection = (macro: MacroCore) =>
  !!(macro as TextMacro).factory;

export class MacrosRegistrar<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> {
  registeredPages: TrmrkPage<THtml, TFormHelper>[] = [];
  currentPage: TrmrkPage<THtml, TFormHelper> | null = null;

  global: TrmrkPageCore = {
    titleCallbacks: [],
    contentCallbacks: [],
    itemsCallbacks: [],
  };

  initPage(currentDirCsId: string, normPath: string, parsedPath: TrmrkUrlPath) {
    this.setCurrentPage({
      csId: currentDirCsId,
      path: normPath,
      parsedPath,
    });
  }

  registerGobalTitle(callback: TextMacroRegistrarCallback<THtml, TFormHelper>) {
    this.global.titleCallbacks.push(callback);
  }

  registerGobalContent(
    callback: TextMacroRegistrarCallback<THtml, TFormHelper>
  ) {
    this.global.contentCallbacks.push(callback);
  }

  registerGobalItems(callback: TextMacroRegistrarCallback<THtml, TFormHelper>) {
    this.global.itemsCallbacks.push(callback);
  }

  registerTitle(callback: ItemsMacroRegistrarCallback<THtml, TFormHelper>) {
    this.currentPage!.titleCallbacks.push(callback);
  }

  registerContent(callback: ItemsMacroRegistrarCallback<THtml, TFormHelper>) {
    this.currentPage!.contentCallbacks.push(callback);
  }

  registerItems(callback: ItemsMacroRegistrarCallback<THtml, TFormHelper>) {
    this.currentPage!.itemsCallbacks.push(callback);
  }

  getTitleMacros() {
    return this.getMacros(
      this.global.titleCallbacks,
      this.currentPage!.titleCallbacks
    );
  }

  getContentMacros() {
    return this.getMacros(
      this.global.contentCallbacks,
      this.currentPage!.contentCallbacks
    );
  }

  getItemsMacros() {
    return this.getMacros(
      this.global.itemsCallbacks,
      this.currentPage!.itemsCallbacks
    );
  }

  private async getMacros<
    TMacro extends MacroCore,
    TMacroSection extends MacroSectionCore<
      TMacro,
      TMacroSection,
      THtml,
      TFormHelper
    >
  >(
    globalCallbacks: MacroRegistrarCallbackCore<
      TMacro,
      TMacroSection,
      THtml,
      TFormHelper
    >[],
    pageCallbacks: MacroRegistrarCallbackCore<
      TMacro,
      TMacroSection,
      THtml,
      TFormHelper
    >[]
  ) {
    const macros: (TMacroSection | TMacro)[] = [];

    for (let callbacksList of [globalCallbacks, pageCallbacks]) {
      for (let callback of callbacksList) {
        const resp = callback(macros);

        if (resp) {
          await resp;
        }
      }
    }

    return macros;
  }

  private setCurrentPage(pageIdnf: DirPathIdnf) {
    let page = this.registeredPages.find(
      (page) => page.idnf.csId === pageIdnf.csId
    );

    if (!page) {
      page = {
        idnf: pageIdnf,
        titleCallbacks: [],
        contentCallbacks: [],
        itemsCallbacks: [],
      };

      this.registeredPages.push(page);
    }

    this.currentPage = page;
  }
}
