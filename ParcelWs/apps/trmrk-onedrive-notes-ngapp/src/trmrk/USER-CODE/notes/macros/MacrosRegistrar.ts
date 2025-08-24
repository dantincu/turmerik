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
> = (
  macros: (TMacroSection | TMacro)[],
  currentDirCsId: string | null,
  currentFileName: string | null
) => void | Promise<VoidOrAny>;

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
  registeredNotes: TrmrkPage<THtml, TFormHelper>[] = [];
  currentNote: TrmrkPage<THtml, TFormHelper> | null = null;

  global: TrmrkPageCore = {
    titleCallbacks: [],
    contentCallbacks: [],
    itemsCallbacks: [],
  };

  setCurrentNote(noteCsId: string, normPath: string, parsedPath: TrmrkUrlPath) {
    let note = this.registeredNotes.find((note) => note.idnf.csId === noteCsId);

    if (!note) {
      note = {
        idnf: {
          csId: noteCsId,
          path: normPath,
          parsedPath,
        },
        titleCallbacks: [],
        contentCallbacks: [],
        itemsCallbacks: [],
      };

      this.registeredNotes.push(note);
    }

    this.currentNote = note;
  }

  unsetCurrentNote() {
    this.currentNote = null;
  }

  registerGobalTitle(callback: TextMacroRegistrarCallback<THtml, TFormHelper>) {
    this.global.titleCallbacks.push(callback);
  }

  registerGobalContent(
    callback: TextMacroRegistrarCallback<THtml, TFormHelper>
  ) {
    this.global.contentCallbacks.push(callback);
  }

  registerGobalItems(
    callback: ItemsMacroRegistrarCallback<THtml, TFormHelper>
  ) {
    this.global.itemsCallbacks.push(callback);
  }

  registerTitle(callback: TextMacroRegistrarCallback<THtml, TFormHelper>) {
    this.currentNote!.titleCallbacks.push(callback);
  }

  registerContent(callback: TextMacroRegistrarCallback<THtml, TFormHelper>) {
    this.currentNote!.contentCallbacks.push(callback);
  }

  registerItems(callback: ItemsMacroRegistrarCallback<THtml, TFormHelper>) {
    this.currentNote!.itemsCallbacks.push(callback);
  }

  getTitleMacros(
    currentDirCsId: string | null = null,
    currentFileName: string | null = null
  ) {
    return this.getMacros(
      this.global.titleCallbacks,
      this.currentNote!.titleCallbacks,
      currentDirCsId,
      currentFileName
    );
  }

  getContentMacros(
    currentDirCsId: string | null = null,
    currentFileName: string | null = null
  ) {
    return this.getMacros(
      this.global.contentCallbacks,
      this.currentNote!.contentCallbacks,
      currentDirCsId,
      currentFileName
    );
  }

  getItemsMacros(
    currentDirCsId: string | null = null,
    currentFileName: string | null = null
  ) {
    return this.getMacros(
      this.global.itemsCallbacks,
      this.currentNote!.itemsCallbacks,
      currentDirCsId,
      currentFileName
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
    >[],
    currentDirCsId: string | null = null,
    currentFileName: string | null = null
  ) {
    const macros: (TMacroSection | TMacro)[] = [];

    for (let callbacksList of [globalCallbacks, pageCallbacks]) {
      for (let callback of callbacksList) {
        const resp = callback(macros, currentDirCsId, currentFileName);

        if (resp) {
          await resp;
        }
      }
    }

    return macros;
  }
}
