import {
  Component,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  OnDestroy,
  EventEmitter,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NullOrUndef, actWithVal } from '../../../../trmrk/core';
import { wsRegex } from '../../../../trmrk/core';
import { TouchOrMouseCoords } from '../../../../trmrk-browser/domUtils/touchAndMouseEvents';

import { whenChanged } from '../../../services/common/simpleChanges';
import { TrmrkLongPressOrRightClick } from '../../../directives/trmrk-long-press-or-right-click';

export interface FocusedCharKeyPressEvent {
  evt: KeyboardEvent;
  currentString: string;
  newString: string;
  focusedCharIdx: number;
  focusedChar: string;
  hasFocusedChar: boolean;
  newChar: string;
  nextFocusedCharIdx: number;
  nextFocusedChar: string;
  hasNextFocusedChar: boolean;
}

export interface CharLongPressOrRightClickEvent {
  srcEvt: TouchOrMouseCoords;
  charIdx: number;
}

export interface CharShortPressOrLeftClickEvent {
  srcEvt: TouchOrMouseCoords;
  focusedCharIdx: number;
  focusedChar: string;
  hasFocusedChar: boolean;
  nextFocusedCharIdx: number;
  nextFocusedChar: string;
}

export interface FocusedCharBtnLongPressEventCore {
  srcEvt: TouchOrMouseCoords;
  focusedCharIdx: number;
  focusedChar: string;
  currentString: string;
  newString: string;
}

export interface FocusedCharDeleteBtnShortPressOrLeftClickEvent
  extends FocusedCharBtnLongPressEventCore {}

export interface FocusedCharDeleteBtnLongPressOrRightClickEvent
  extends FocusedCharBtnLongPressEventCore {}

export interface FocusedCharInsertBtnLongPressEventCore extends FocusedCharBtnLongPressEventCore {
  insertAfter: boolean;
}

export interface FocusedCharInsertBtnShortPressOrLeftClickEvent
  extends FocusedCharInsertBtnLongPressEventCore {}

export interface FocusedCharInsertBtnLongPressOrRightClickEvent
  extends FocusedCharInsertBtnLongPressEventCore {}

interface TrmrkCharWrapper {
  id: number;
  value: string;
  isWhitespace: boolean;
}

@Component({
  selector: 'trmrk-short-string-editor',
  imports: [CommonModule, MatButtonModule, MatIconModule, TrmrkLongPressOrRightClick],
  templateUrl: './trmrk-short-string-editor.html',
  styleUrl: './trmrk-short-string-editor.scss',
})
export class TrmrkShortStringEditor implements OnChanges, OnDestroy {
  @Output() trmrkInsertFirstCharClick = new EventEmitter<void>();
  @Output() trmrkCharShortPressOrLeftClick = new EventEmitter<CharShortPressOrLeftClickEvent>();
  @Output() trmrkCharLongPressOrRightClick = new EventEmitter<CharLongPressOrRightClickEvent>();

  @Output() trmrkCharDeleteBtnShortPressOrLeftClick =
    new EventEmitter<FocusedCharDeleteBtnShortPressOrLeftClickEvent>();

  @Output() trmrkCharDeleteBtnLongPressOrRightClick =
    new EventEmitter<FocusedCharDeleteBtnLongPressOrRightClickEvent>();

  @Output() trmrkCharInsertBtnShortPressOrLeftClick =
    new EventEmitter<FocusedCharInsertBtnShortPressOrLeftClickEvent>();

  @Output() trmrkCharInsertBtnLongPressOrRightClick =
    new EventEmitter<FocusedCharInsertBtnLongPressOrRightClickEvent>();

  @Output() trmrkInputKeyPressed = new EventEmitter<FocusedCharKeyPressEvent>();

  @Input() trmrkCssClass: string | NullOrUndef;
  @Input() trmrkDigitsOnly: boolean | NullOrUndef;
  @Input() trmrkString = '';
  @Input() trmrkFocusedCharIdx = -1;
  @Input() trmrkFocusInput = 0;
  @Input() trmrkBlurInput = 0;

  @Input() trmrkCharCssClassFactory:
    | ((chr: string, idx: number) => string | NullOrUndef)
    | NullOrUndef;

  @Input() trmrkAllowDeleteFocusedChar: boolean | NullOrUndef;
  @Input() trmrkAllowInsertCharBeforeFocused: boolean | NullOrUndef;
  @Input() trmrkAllowInsertCharAfterFocused: boolean | NullOrUndef;

  @Input() trmrkLeadingTemplate: TemplateRef<any> | NullOrUndef;
  @Input() trmrkTrailingTemplate: TemplateRef<any> | NullOrUndef;
  @Input() trmrkBeforeCharWrapperTemplate: TemplateRef<any> | NullOrUndef;
  @Input() trmrkAfterCharWrapperTemplate: TemplateRef<any> | NullOrUndef;
  @Input() trmrkCharTemplate: TemplateRef<any> | NullOrUndef;
  @Input() trmrkUseCharTemplate: boolean | NullOrUndef;
  @Input() trmrkHasError: boolean | NullOrUndef;
  @Input() trmrkErrorMessage: string | NullOrUndef;

  @ViewChild('fakeNumberInput') fakeNumberInput!: ElementRef<HTMLInputElement>;

  chars: TrmrkCharWrapper[] = [];

  private _nextCharId = 1;

  constructor(public hostEl: ElementRef<HTMLElement>) {
    this.fakeNumberInputKeyPressed = this.fakeNumberInputKeyPressed.bind(this);

    setTimeout(() => {
      this.fakeNumberInput.nativeElement.addEventListener(
        'keypress',
        this.fakeNumberInputKeyPressed
      );
    });
  }

  ngOnDestroy(): void {
    this.fakeNumberInput.nativeElement.removeEventListener(
      'keypress',
      this.fakeNumberInputKeyPressed
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    whenChanged(
      changes,
      () => this.trmrkString,
      () => {
        this.chars = [...this.trmrkString].map((char) => ({
          id: this._nextCharId++,
          value: char,
          isWhitespace: wsRegex().test(char),
        }));
      }
    );

    whenChanged(
      changes,
      () => this.trmrkFocusInput,
      () => {
        if (this.trmrkFocusInput) {
          setTimeout(() => {
            this.fakeNumberInput.nativeElement.focus();
          });
        }
      }
    );

    whenChanged(
      changes,
      () => this.trmrkBlurInput,
      () => {
        if (this.trmrkBlurInput) {
          setTimeout(() => {
            this.fakeNumberInput.nativeElement.blur();
          });
        }
      }
    );
  }

  charDeleteBtnShortPressOrLeftClick(srcEvt: TouchOrMouseCoords, focusedCharIdx: number) {
    const event = {
      srcEvt,
      focusedCharIdx,
      focusedChar: this.trmrkString[focusedCharIdx],
      currentString: this.trmrkString,
      newString: actWithVal([...this.trmrkString], (charsArr) =>
        charsArr.splice(focusedCharIdx, 1)
      ).join(''),
    } as FocusedCharDeleteBtnShortPressOrLeftClickEvent;

    this.trmrkCharDeleteBtnShortPressOrLeftClick.emit(event);
  }

  charDeleteBtnLongPressOrRightClick(srcEvt: TouchOrMouseCoords, focusedCharIdx: number) {
    const event = {
      srcEvt,
      focusedCharIdx,
      focusedChar: this.trmrkString[focusedCharIdx],
      currentString: this.trmrkString,
      newString: '',
    } as FocusedCharDeleteBtnShortPressOrLeftClickEvent;

    this.trmrkCharDeleteBtnLongPressOrRightClick.emit(event);
  }

  charInsertBtnShortPressOrLeftClick(
    srcEvt: TouchOrMouseCoords,
    focusedCharIdx: number,
    insertAfter: boolean
  ) {
    const event = {
      srcEvt,
      focusedCharIdx,
      insertAfter,
      focusedChar: this.trmrkString[focusedCharIdx],
      currentString: this.trmrkString,
      newString: actWithVal([...this.trmrkString], (charsArr) =>
        charsArr.splice(focusedCharIdx + (insertAfter ? 1 : 0), 0, ' ')
      ).join(''),
    } as FocusedCharInsertBtnShortPressOrLeftClickEvent;

    this.trmrkCharInsertBtnShortPressOrLeftClick.emit(event);
  }

  charInsertBtnLongPressOrRightClick(
    srcEvt: TouchOrMouseCoords,
    focusedCharIdx: number,
    insertAfter: boolean
  ) {
    const event = {
      srcEvt,
      focusedCharIdx,
      insertAfter,
    } as FocusedCharInsertBtnShortPressOrLeftClickEvent;

    this.trmrkCharInsertBtnLongPressOrRightClick.emit(event);
  }

  insertFirstCharClick() {
    this.trmrkInsertFirstCharClick.emit();
  }

  charLongPressOrRightClick(srcEvt: TouchOrMouseCoords, charIdx: number) {
    const event: CharLongPressOrRightClickEvent = {
      srcEvt,
      charIdx,
    };

    this.trmrkCharLongPressOrRightClick.emit(event);
  }

  charShortPressOrLeftClick(srcEvt: TouchOrMouseCoords, nextFocusedCharIdx: number) {
    const event = {
      srcEvt,
      focusedCharIdx: this.trmrkFocusedCharIdx,
      focusedChar: this.chars[this.trmrkFocusedCharIdx]?.value ?? null,
      nextFocusedCharIdx,
      nextFocusedChar: this.chars[nextFocusedCharIdx].value,
    } as CharShortPressOrLeftClickEvent;

    event.hasFocusedChar = (event.focusedChar ?? null) !== null;
    this.trmrkCharShortPressOrLeftClick.emit(event);
  }

  fakeNumberInputKeyPressed(evt: KeyboardEvent) {
    const event = {
      evt,
      currentString: this.trmrkString,
      newString: this.trmrkString,
      focusedCharIdx: this.trmrkFocusedCharIdx,
      focusedChar: this.chars[this.trmrkFocusedCharIdx]?.value ?? null,
      newChar: evt.key,
    } as FocusedCharKeyPressEvent;

    event.hasFocusedChar = (event.focusedChar ?? null) !== null;
    event.nextFocusedCharIdx = this.trmrkFocusedCharIdx + 1;

    if ((event.hasNextFocusedChar = event.nextFocusedCharIdx < event.currentString.length)) {
      event.nextFocusedChar = event.currentString[event.nextFocusedCharIdx];
    }

    if (
      event.hasFocusedChar &&
      (this.trmrkDigitsOnly !== true || (event.newChar >= '0' && event.newChar <= '9'))
    ) {
      event.newString = actWithVal([...event.currentString], (charsArr) =>
        charsArr.splice(event.focusedCharIdx, 1, event.newChar)
      ).join('');
    }

    this.trmrkInputKeyPressed.emit(event);
    this.fakeNumberInput.nativeElement.value = '';
  }
}
