import { VoidOrAny } from '../../../core';
import { TrmrkUrlPath } from '../../notes/types';

import { MacroCore, Macro, MacroSection } from './types';
import { NodeHtml } from '../../forms/types';
import { TrmrkFormHelper } from '../../forms/trmrkForm';

export interface RegisterMacrosArgs<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> {
  title: (MacroSection<THtml, TFormHelper> | Macro<THtml, TFormHelper>)[];
  content: (MacroSection<THtml, TFormHelper> | Macro<THtml, TFormHelper>)[];
}

export interface DirPathIdnf {
  csId: string;
  path: string;
  parsedPath: TrmrkUrlPath;
}

export type MacroRegistrarCallback<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> = (arg: RegisterMacrosArgs<THtml, TFormHelper>) => VoidOrAny;

export interface TrmrkPage<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> {
  idnf: DirPathIdnf;
  callbacks: MacroRegistrarCallback<THtml, TFormHelper>[];
}

export interface MacrosRegistrarCallbacks<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> {
  global: MacroRegistrarCallback<THtml, TFormHelper>[];
  page: MacroRegistrarCallback<THtml, TFormHelper>[];
}

export const isMacroSection = (macro: MacroCore) => !!(macro as Macro).factory;

export class MacrosRegistrar<
  THtml = NodeHtml,
  TFormHelper extends TrmrkFormHelper<THtml> = TrmrkFormHelper<THtml>
> {
  registeredPages: TrmrkPage<THtml, TFormHelper>[] = [];
  currentPage: TrmrkPage<THtml, TFormHelper> | null = null;
  globalCallbacks: MacroRegistrarCallback<THtml, TFormHelper>[] = [];
  title!: (MacroSection<THtml, TFormHelper> | Macro<THtml, TFormHelper>)[];
  content!: (MacroSection<THtml, TFormHelper> | Macro<THtml, TFormHelper>)[];

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

  registerGobal(callback: MacroRegistrarCallback<THtml, TFormHelper>) {
    this.registerCore(callback, this.globalCallbacks);
  }

  register(callback: MacroRegistrarCallback<THtml, TFormHelper>) {
    this.registerCore(callback, this.currentPage!.callbacks);
  }

  private registerCore(
    callback: MacroRegistrarCallback<THtml, TFormHelper>,
    callbacks: MacroRegistrarCallback<THtml, TFormHelper>[]
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

  private fireCallBack(callback: MacroRegistrarCallback<THtml, TFormHelper>) {
    callback({
      title: this.title,
      content: this.content,
    });
  }
}
