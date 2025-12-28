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
import { UserMessageLevel } from '../../../../trmrk/core';

import { whenChanged } from '../../../services/common/simpleChanges';
import { TrmrkLongPressOrRightClick } from '../../../directives/trmrk-long-press-or-right-click';
import { TrmrkTouchStartOrMouseDown } from '../../../directives/trmrk-touch-start-or-mouse-down';
import { TrmrkDynamicAttributesDirective } from '../../../directives/trmrk-dynamic-attributes';

import { TrmrkUserMessage } from '../trmrk-user-message/trmrk-user-message';

export interface ClipboardEvent {
  text: string;
}

export interface FocusedCharKeyboardEvent {
  srcEvt: KeyboardEvent;
  currentString: string;
  newString: string;
  focusedCharIdx: number;
  focusedChar: string;
  hasFocusedChar: boolean;
  nextFocusedCharIdx: number;
  nextFocusedChar: string;
  hasNextFocusedChar: boolean;
}

export interface FocusedCharKeyPressEvent extends FocusedCharKeyboardEvent {
  newChar: string;
}

export interface FocusedCharKeyDownEvent extends FocusedCharKeyboardEvent {
  key: string;
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

export const getNewStringForDeleteCurrentChar = (text: string, focusedCharIdx: number) =>
  focusedCharIdx >= 0
    ? actWithVal([...text], (charsArr) => charsArr.splice(focusedCharIdx, 1)).join('')
    : text;

export const getNewStringForDeleteToTheRight = (text: string, focusedCharIdx: number) =>
  text.substring(0, Math.min(Math.max(focusedCharIdx, 0), text.length));

export const getNewStringForDeletePrevChar = (text: string, focusedCharIdx: number) =>
  focusedCharIdx > 0
    ? actWithVal([...text], (charsArr) => charsArr.splice(focusedCharIdx, 1)).join('')
    : text;

export const getNewStringForDeleteToTheLeft = (text: string, focusedCharIdx: number) =>
  text.substring(Math.min(Math.max(focusedCharIdx + 1, 0)));

export const getNewStringForInsertChar = (
  text: string,
  focusedCharIdx: number,
  insertAtTheEnd: boolean
) =>
  insertAtTheEnd
    ? text + ' '
    : actWithVal([...text], (charsArr) => charsArr.splice(focusedCharIdx, 0, ' ')).join('');

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
    TrmrkUserMessage,
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

  @Output() trmrkCharBackspaceBtnShortPressOrLeftClick =
    new EventEmitter<FocusedCharDeleteBtnShortPressOrLeftClickEvent>();

  @Output() trmrkCharBackspaceBtnLongPressOrRightClick =
    new EventEmitter<FocusedCharDeleteBtnLongPressOrRightClickEvent>();

  @Output() trmrkCharInsertBtnShortPressOrLeftClick =
    new EventEmitter<FocusedCharInsertBtnShortPressOrLeftClickEvent>();

  @Output() trmrkCharInsertBtnLongPressOrRightClick =
    new EventEmitter<FocusedCharInsertBtnLongPressOrRightClickEvent>();

  @Output() trmrkCopiedToClipboard = new EventEmitter<ClipboardEvent>();
  @Output() trmrkPasteFromClipboardClicked = new EventEmitter<ClipboardEvent>();

  @Output() trmrkInputKeyPressed = new EventEmitter<FocusedCharKeyPressEvent>();
  @Output() trmrkInputKeyDown = new EventEmitter<FocusedCharKeyDownEvent>();
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
  @Input() trmrkBeforeDoneBtnTemplate: TemplateRef<any> | NullOrUndef;
  @Input() trmrkBeforeCharWrapperTemplate: TemplateRef<any> | NullOrUndef;
  @Input() trmrkAfterCharWrapperTemplate: TemplateRef<any> | NullOrUndef;
  @Input() trmrkCharTemplate: TemplateRef<any> | NullOrUndef;
  @Input() trmrkUseCharTemplate: boolean | NullOrUndef;
  @Input() trmrkShowDoneBtn: boolean | NullOrUndef;
  @Input() trmrkShowCopyToClipboardBtn: boolean | NullOrUndef;
  @Input() trmrkShowPasteFromClipboardBtn: boolean | NullOrUndef;

  UserMessageLevel = UserMessageLevel;

  @ViewChild('fakeNumberInput') fakeNumberInput!: ElementRef<HTMLInputElement>;

  chars: TrmrkCharWrapper[] = [];

  showCopiedToClipboardSuccessMessage = 0;

  private _nextCharId = 1;

  constructor(public hostEl: ElementRef<HTMLElement>) {
    this.fakeNumberInputKeyPressed = this.fakeNumberInputKeyPressed.bind(this);
    this.fakeNumberInputKeyDown = this.fakeNumberInputKeyDown.bind(this);

    setTimeout(() => {
      this.fakeNumberInput.nativeElement.addEventListener(
        'keypress',
        this.fakeNumberInputKeyPressed
      );

      this.fakeNumberInput.nativeElement.addEventListener('keydown', this.fakeNumberInputKeyDown);
    });
  }

  ngOnDestroy(): void {
    this.fakeNumberInput.nativeElement.removeEventListener(
      'keypress',
      this.fakeNumberInputKeyPressed
    );

    this.fakeNumberInput.nativeElement.removeEventListener('keydown', this.fakeNumberInputKeyDown);
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
      newString: getNewStringForDeleteCurrentChar(this.trmrkString, this.trmrkFocusedCharIdx),
    } as FocusedCharDeleteBtnShortPressOrLeftClickEvent;

    this.trmrkCharDeleteBtnShortPressOrLeftClick.emit(event);
  }

  charDeleteBtnLongPressOrRightClick(srcEvt: TouchOrMouseCoords) {
    const event = {
      srcEvt,
      focusedCharIdx: this.trmrkFocusedCharIdx,
      focusedChar: this.trmrkString[this.trmrkFocusedCharIdx],
      currentString: this.trmrkString,
      newString: getNewStringForDeleteToTheRight(this.trmrkString, this.trmrkFocusedCharIdx),
    } as FocusedCharDeleteBtnShortPressOrLeftClickEvent;

    this.trmrkCharDeleteBtnLongPressOrRightClick.emit(event);
  }

  charBackspaceBtnShortPressOrLeftClick(srcEvt: TouchOrMouseCoords) {
    const event = {
      srcEvt,
      focusedCharIdx: this.trmrkFocusedCharIdx,
      focusedChar: this.trmrkString[this.trmrkFocusedCharIdx],
      currentString: this.trmrkString,
      newString: getNewStringForDeletePrevChar(this.trmrkString, this.trmrkFocusedCharIdx),
    } as FocusedCharDeleteBtnShortPressOrLeftClickEvent;

    this.trmrkCharBackspaceBtnShortPressOrLeftClick.emit(event);
  }

  charBackspaceBtnLongPressOrRightClick(srcEvt: TouchOrMouseCoords) {
    const event = {
      srcEvt,
      focusedCharIdx: this.trmrkFocusedCharIdx,
      focusedChar: this.trmrkString[this.trmrkFocusedCharIdx],
      currentString: this.trmrkString,
      newString: getNewStringForDeleteToTheLeft(this.trmrkString, this.trmrkFocusedCharIdx),
    } as FocusedCharDeleteBtnShortPressOrLeftClickEvent;

    this.trmrkCharBackspaceBtnLongPressOrRightClick.emit(event);
  }

  charInsertBtnShortPressOrLeftClick(srcEvt: TouchOrMouseCoords, insertAtTheEnd: boolean) {
    const event = {
      srcEvt,
      focusedCharIdx: this.trmrkFocusedCharIdx,
      insertAtTheEnd: insertAtTheEnd,
      focusedChar: this.trmrkString[this.trmrkFocusedCharIdx],
      currentString: this.trmrkString,
      newString: getNewStringForInsertChar(
        this.trmrkString,
        this.trmrkFocusedCharIdx,
        insertAtTheEnd
      ),
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

  fakeNumberInputKeyPressed(srcEvt: KeyboardEvent) {
    const event = {
      srcEvt,
      currentString: this.trmrkString,
      newString: this.trmrkString,
      focusedCharIdx: this.trmrkFocusedCharIdx,
      focusedChar: this.chars[this.trmrkFocusedCharIdx]?.value ?? null,
      newChar: srcEvt.key,
    } as FocusedCharKeyPressEvent;

    event.hasFocusedChar = (event.focusedChar ?? null) !== null;
    event.nextFocusedCharIdx = this.trmrkFocusedCharIdx + 1;

    event.nextFocusedChar = event.currentString[event.nextFocusedCharIdx] ?? null;
    event.hasNextFocusedChar = (event.nextFocusedChar ?? null) !== null;

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

  fakeNumberInputKeyDown(srcEvt: KeyboardEvent) {
    const event = {
      srcEvt,
      currentString: this.trmrkString,
      newString: this.trmrkString,
      focusedCharIdx: this.trmrkFocusedCharIdx,
      focusedChar: this.chars[this.trmrkFocusedCharIdx]?.value ?? null,
      nextFocusedCharIdx: this.trmrkFocusedCharIdx,
      key: srcEvt.key,
    } as FocusedCharKeyDownEvent;

    event.hasFocusedChar = (event.focusedChar ?? null) !== null;

    switch (event.key) {
      case 'Home':
        event.nextFocusedCharIdx = 0;
        break;
      case 'End':
        event.nextFocusedCharIdx = event.currentString.length - 1;
        break;
      case 'ArrowLeft':
        event.nextFocusedCharIdx--;
        break;
      case 'ArrowRight':
        event.nextFocusedCharIdx++;
        break;
      case 'Delete':
        if (srcEvt.ctrlKey) {
          event.newString = getNewStringForDeleteToTheRight(
            this.trmrkString,
            this.trmrkFocusedCharIdx
          );
        } else {
          event.newString = getNewStringForDeleteCurrentChar(
            this.trmrkString,
            this.trmrkFocusedCharIdx
          );
        }
        break;
      case 'BackSpace':
        if (srcEvt.ctrlKey) {
          event.newString = getNewStringForDeleteToTheLeft(
            this.trmrkString,
            this.trmrkFocusedCharIdx
          );

          event.nextFocusedCharIdx = 0;
        } else {
          event.newString = getNewStringForDeletePrevChar(
            this.trmrkString,
            this.trmrkFocusedCharIdx
          );

          event.nextFocusedCharIdx--;
        }

        break;
    }

    event.nextFocusedChar = event.newString[event.nextFocusedCharIdx] ?? null;
    event.hasNextFocusedChar = (event.nextFocusedChar ?? null) !== null;
    this.trmrkInputKeyDown.emit(event);
  }

  async copyToClipboardClicked() {
    const event: ClipboardEvent = {
      text: this.trmrkString,
    };

    await navigator.clipboard.writeText(event.text);
    this.showCopiedToClipboardSuccessMessage++;
    this.trmrkCopiedToClipboard.emit(event);
  }

  async pasteFromClipboardClicked() {
    const event: ClipboardEvent = {
      text: await navigator.clipboard.readText(),
    };

    this.trmrkPasteFromClipboardClicked.emit(event);
  }

  doNothing() {}
}
