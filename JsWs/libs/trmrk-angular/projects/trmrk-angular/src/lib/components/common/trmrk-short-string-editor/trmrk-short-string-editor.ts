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
import { TrmrkTouchStartOrMouseDown } from '../../../directives/trmrk-touch-start-or-mouse-down';
import { TrmrkDynamicAttributesDirective } from '../../../directives/trmrk-dynamic-attributes';

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
  insertAtTheEnd: boolean;
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
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    TrmrkLongPressOrRightClick,
    TrmrkTouchStartOrMouseDown,
    TrmrkDynamicAttributesDirective,
  ],
  templateUrl: './trmrk-short-string-editor.html',
  styleUrl: './trmrk-short-string-editor.scss',
})
export class TrmrkShortStringEditor implements OnChanges, OnDestroy {
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
  @Output() trmrkDoneBtnTouchStartOrMouseDown = new EventEmitter<TouchEvent | MouseEvent>();

  @Input() trmrkInputAttrs: { [key: string]: string } | NullOrUndef;
  @Input() trmrkCssClass: string | NullOrUndef;
  @Input() trmrkDigitsOnly: boolean | NullOrUndef;
  @Input() trmrkString = '';
  @Input() trmrkFocusedCharIdx = -1;
  @Input() trmrkFocusInput = 0;
  @Input() trmrkBlurInput = 0;

  @Input() trmrkCharCssClassFactory:
    | ((chr: string, idx: number) => string | NullOrUndef)
    | NullOrUndef;

  @Input() trmrkAllowDeleteChar: boolean | NullOrUndef;
  @Input() trmrkAllowInsertChar: boolean | NullOrUndef;

  @Input() trmrkLeadingTemplate: TemplateRef<any> | NullOrUndef;
  @Input() trmrkTrailingTemplate: TemplateRef<any> | NullOrUndef;
  @Input() trmrkBeforeCharWrapperTemplate: TemplateRef<any> | NullOrUndef;
  @Input() trmrkAfterCharWrapperTemplate: TemplateRef<any> | NullOrUndef;
  @Input() trmrkCharTemplate: TemplateRef<any> | NullOrUndef;
  @Input() trmrkUseCharTemplate: boolean | NullOrUndef;

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

  containerTouchStartOrMouseDown(event: MouseEvent | TouchEvent) {
    event.preventDefault();
  }

  doneBtnTouchStartOrMouseDown(event: MouseEvent | TouchEvent) {
    event.stopPropagation();
    this.trmrkDoneBtnTouchStartOrMouseDown.emit(event);
  }

  charDeleteBtnShortPressOrLeftClick(srcEvt: TouchOrMouseCoords) {
    const event = {
      srcEvt,
      focusedCharIdx: this.trmrkFocusedCharIdx,
      focusedChar: this.trmrkString[this.trmrkFocusedCharIdx],
      currentString: this.trmrkString,
      newString:
        this.trmrkFocusedCharIdx >= 0
          ? actWithVal([...this.trmrkString], (charsArr) =>
              charsArr.splice(this.trmrkFocusedCharIdx, 1)
            ).join('')
          : this.trmrkString,
    } as FocusedCharDeleteBtnShortPressOrLeftClickEvent;

    this.trmrkCharDeleteBtnShortPressOrLeftClick.emit(event);
  }

  charDeleteBtnLongPressOrRightClick(srcEvt: TouchOrMouseCoords) {
    const event = {
      srcEvt,
      focusedCharIdx: this.trmrkFocusedCharIdx,
      focusedChar: this.trmrkString[this.trmrkFocusedCharIdx],
      currentString: this.trmrkString,
      newString: '',
    } as FocusedCharDeleteBtnShortPressOrLeftClickEvent;

    this.trmrkCharDeleteBtnLongPressOrRightClick.emit(event);
  }

  charInsertBtnShortPressOrLeftClick(srcEvt: TouchOrMouseCoords, insertAtTheEnd: boolean) {
    const event = {
      srcEvt,
      focusedCharIdx: this.trmrkFocusedCharIdx,
      insertAtTheEnd: insertAtTheEnd,
      focusedChar: this.trmrkString[this.trmrkFocusedCharIdx],
      currentString: this.trmrkString,
      newString: insertAtTheEnd
        ? this.trmrkString + ' '
        : actWithVal([...this.trmrkString], (charsArr) =>
            charsArr.splice(this.trmrkFocusedCharIdx, 0, ' ')
          ).join(''),
    } as FocusedCharInsertBtnShortPressOrLeftClickEvent;

    this.trmrkCharInsertBtnShortPressOrLeftClick.emit(event);
  }

  charInsertBtnLongPressOrRightClick(srcEvt: TouchOrMouseCoords, insertAtTheEnd: boolean) {
    const event = {
      srcEvt,
      focusedCharIdx: this.trmrkFocusedCharIdx,
      insertAtTheEnd: insertAtTheEnd,
    } as FocusedCharInsertBtnShortPressOrLeftClickEvent;

    this.trmrkCharInsertBtnLongPressOrRightClick.emit(event);
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
