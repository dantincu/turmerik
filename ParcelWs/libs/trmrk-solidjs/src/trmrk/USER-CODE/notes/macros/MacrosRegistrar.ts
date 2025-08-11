import { VoidOrAny } from '../../../core';
import { TrmrkUrlPath } from '../../notes/types';

import {
  MacroCore,
  Macro,
  ContentMacro,
  ContentMacroSection,
  TitleMacro,
  TitleMacroSection,
} from './types';

export interface RegisterMacrosArgs {
  title: (TitleMacroSection | TitleMacro)[];
  content: (ContentMacroSection | ContentMacro)[];
}

export interface DirPathIdnf {
  csId: string;
  path: string;
  parsedPath: TrmrkUrlPath;
}

export type MacroRegistrarCallback = (arg: RegisterMacrosArgs) => VoidOrAny;

export interface TrmrkPage {
  idnf: DirPathIdnf;
  callbacks: MacroRegistrarCallback[];
}

export interface MacrosRegistrarCallbacks {
  global: MacroRegistrarCallback[];
  page: MacroRegistrarCallback[];
}

export const isMacroSection = (macro: MacroCore) =>
  !!(macro as Macro<any, any>).factory;

export class MacrosRegistrar {
  registeredPages: TrmrkPage[] = [];
  currentPage: TrmrkPage | null = null;
  globalCallbacks: MacroRegistrarCallback[] = [];
  title!: (TitleMacroSection | TitleMacro)[];
  content!: (ContentMacroSection | ContentMacro)[];

  initPage(currentDirCsId: string, normPath: string, parsedPath: TrmrkUrlPath) {
    this.title = [];
    this.content = [];
    this.currentPage = null;

    for (let callback of this.globalCallbacks) {
      this.fireCallBack(callback);
    }

    this.setCurrentPage({
      csId: currentDirCsId,
      path: normPath,
      parsedPath,
    });
  }

  registerGobal(callback: MacroRegistrarCallback) {
    this.registerCore(callback, this.globalCallbacks);
  }

  register(callback: MacroRegistrarCallback) {
    this.registerCore(callback, this.currentPage!.callbacks);
  }

  private registerCore(
    callback: MacroRegistrarCallback,
    callbacks: MacroRegistrarCallback[]
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

  private fireCallBack(callback: MacroRegistrarCallback) {
    callback({
      title: this.title,
      content: this.content,
    });
  }
}
