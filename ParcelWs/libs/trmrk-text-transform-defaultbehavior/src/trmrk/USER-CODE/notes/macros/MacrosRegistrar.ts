import { VoidOrAny } from '../../../core';
import { TrmrkUrlPath } from '../../notes/types';

import { MacroCore, Macro, MacroSection } from './types';
import { NodeHtml } from '../../forms/types';
import { TrmrkFormHelper } from '../../forms/trmrkForm';

export interface RegisterMacrosArgs<
  TData = any,
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<TData, THtml> = TrmrkFormHelper<
    TData,
    THtml
  >
> {
  title: (
    | MacroSection<TData, THtml, TFormHelper>
    | Macro<TData, THtml, TFormHelper>
  )[];
  content: (
    | MacroSection<TData, THtml, TFormHelper>
    | Macro<TData, THtml, TFormHelper>
  )[];
}

export interface DirPathIdnf {
  csId: string;
  path: string;
  parsedPath: TrmrkUrlPath;
}

export type MacroRegistrarCallback<
  TData = any,
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<TData, THtml> = TrmrkFormHelper<
    TData,
    THtml
  >
> = (arg: RegisterMacrosArgs<TData, THtml, TFormHelper>) => VoidOrAny;

export interface TrmrkPage<
  TData = any,
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<TData, THtml> = TrmrkFormHelper<
    TData,
    THtml
  >
> {
  idnf: DirPathIdnf;
  callbacks: MacroRegistrarCallback<TData, THtml, TFormHelper>[];
}

export interface MacrosRegistrarCallbacks<
  TData = any,
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<TData, THtml> = TrmrkFormHelper<
    TData,
    THtml
  >
> {
  global: MacroRegistrarCallback<TData, THtml, TFormHelper>[];
  page: MacroRegistrarCallback<TData, THtml, TFormHelper>[];
}

export const isMacroSection = (macro: MacroCore) => !!(macro as Macro).factory;

export class MacrosRegistrar<
  TData = any,
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<TData, THtml> = TrmrkFormHelper<
    TData,
    THtml
  >
> {
  registeredPages: TrmrkPage<TData, THtml, TFormHelper>[] = [];
  currentPage: TrmrkPage<TData, THtml, TFormHelper> | null = null;
  globalCallbacks: MacroRegistrarCallback<TData, THtml, TFormHelper>[] = [];
  title!: (
    | MacroSection<TData, THtml, TFormHelper>
    | Macro<TData, THtml, TFormHelper>
  )[];
  content!: (
    | MacroSection<TData, THtml, TFormHelper>
    | Macro<TData, THtml, TFormHelper>
  )[];

  reset() {
    this.globalCallbacks = [];
    this.resetPage();
  }

  resetPage() {
    this.resetPageCore();

    if (this.currentPage) {
      const idx = this.registeredPages.indexOf(this.currentPage);
      this.registeredPages.splice(idx, 1);
    }
  }

  resetPageCore() {
    this.title = [];
    this.content = [];
    this.currentPage = null;
  }

  initPage(currentDirCsId: string, normPath: string, parsedPath: TrmrkUrlPath) {
    this.resetPageCore();

    for (let callback of this.globalCallbacks) {
      this.fireCallBack(callback);
    }

    this.setCurrentPage({
      csId: currentDirCsId,
      path: normPath,
      parsedPath,
    });
  }

  registerGobal(callback: MacroRegistrarCallback<TData, THtml, TFormHelper>) {
    this.registerCore(callback, this.globalCallbacks);
  }

  register(callback: MacroRegistrarCallback<TData, THtml, TFormHelper>) {
    this.registerCore(callback, this.currentPage!.callbacks);
  }

  private registerCore(
    callback: MacroRegistrarCallback<TData, THtml, TFormHelper>,
    callbacks: MacroRegistrarCallback<TData, THtml, TFormHelper>[]
  ) {
    callbacks.push(callback);
    this.fireCallBack(callback);
  }

  private setCurrentPage(pageIdnf: DirPathIdnf) {
    let page = this.registeredPages.find(
      (page) => page.idnf.csId === pageIdnf.csId
    );

    if (page) {
      for (let callback of page.callbacks) {
        this.fireCallBack(callback);
      }
    } else {
      page = {
        idnf: pageIdnf,
        callbacks: [],
      };

      this.registeredPages.push(page);
    }

    this.currentPage = page;
  }

  private fireCallBack(
    callback: MacroRegistrarCallback<TData, THtml, TFormHelper>
  ) {
    callback({
      title: this.title,
      content: this.content,
    });
  }
}
