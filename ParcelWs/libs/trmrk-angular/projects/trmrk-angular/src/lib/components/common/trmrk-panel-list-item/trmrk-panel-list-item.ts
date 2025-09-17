import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ChangeDetectionStrategy,
  ElementRef,
  OnDestroy,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgTemplateOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';

import { NullOrUndef } from '../../../../trmrk/core';

import { TrmrkLongPressOrRightClick } from '../../../directives/trmrk-long-press-or-right-click';
import { TrmrkTouchStartOrMouseDown } from '../../../directives/trmrk-touch-start-or-mouse-down';

import {
  TrmrkHorizStrip,
  TrmrkHorizStripType,
  TrmrkHorizStripDetailsTextPart,
} from '../trmrk-horiz-strip/trmrk-horiz-strip';

import { TouchOrMouseCoords } from '../../../../trmrk-browser/domUtils/touchAndMouseEvents';

@Component({
  selector: 'trmrk-panel-list-item',
  imports: [
    CommonModule,
    TrmrkHorizStrip,
    NgTemplateOutlet,
    MatIconModule,
    MatButtonModule,
    MatIconButton,
    TrmrkLongPressOrRightClick,
    MatCheckbox,
    TrmrkTouchStartOrMouseDown,
  ],
  templateUrl: './trmrk-panel-list-item.html',
  styleUrl: './trmrk-panel-list-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrmrkPanelListItem<TInputData = any> implements OnDestroy {
  @Output() trmrkExpandedToggled = new EventEmitter<boolean>();
  @Output() trmrkCheckBoxToggled = new EventEmitter<MatCheckboxChange>();

  @Output() trmrkLeadingBtnLongPressOrRightClick = new EventEmitter<TouchOrMouseCoords>();

  @Output() trmrkLeadingBtnShortPressOrLeftClick = new EventEmitter<TouchOrMouseCoords>();

  @Output() trmrkLeadingIconBtnMouseDownOrTouchStart = new EventEmitter<MouseEvent | TouchEvent>();

  @Output()
  trmrkGoToParentBtnLongPressOrRightClick = new EventEmitter<TouchOrMouseCoords>();

  @Output() trmrkGoToParentBtnShortPressOrLeftClick = new EventEmitter<TouchOrMouseCoords>();

  @Output() trmrkGoToParentBtnMouseDownOrTouchStart = new EventEmitter<MouseEvent | TouchEvent>();

  @Output() trmrkColorLabelBtnLongPressOrRightClick = new EventEmitter<TouchOrMouseCoords>();

  @Output() trmrkColorLabelBtnShortPressOrLeftClick = new EventEmitter<TouchOrMouseCoords>();

  @Output() trmrkColorLabelBtnMouseDownOrTouchStart = new EventEmitter<MouseEvent | TouchEvent>();

  @Output() trmrkTextLongPressOrRightClick = new EventEmitter<TouchOrMouseCoords>();

  @Output() trmrkTextShortPressOrLeftClick = new EventEmitter<TouchOrMouseCoords>();

  @Output() trmrkTextMouseDownOrTouchStart = new EventEmitter<MouseEvent | TouchEvent>();

  @Input() trmrkLeadingBtnLongPressAltHost: (() => HTMLElement[]) | null = null;
  @Input() trmrkGoToParentBtnLongPressAltHost: (() => HTMLElement[]) | null = null;

  @Input() trmrkColorLabelBtnLongPressAltHost: (() => HTMLElement[]) | null = null;

  @Input() trmrkTextLongPressAltHost: (() => HTMLElement[]) | null = null;

  @Input() trmrkIsAppBar = false;
  @Input() trmrkMainText!: string;
  @Input() trmrkDetailsTextParts: (string | TrmrkHorizStripDetailsTextPart)[] | null = null;
  @Input() trmrkCssClass: string[] = [];
  @Input() trmrkIsExpandable?: boolean | NullOrUndef;
  @Input() trmrkIsExpanded = false;
  @Input() trmrkIsSelectable = false;
  @Input() trmrkIsSelected = false;
  @Input() trmrkIsFocused = false;
  @Input() trmrkLeadingMatIconName?: string | NullOrUndef;
  @Input() trmrkLeadingIconTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkShowGoToParentBtn?: boolean | NullOrUndef;
  @Input() trmrkGoToParentMatIconName?: string | NullOrUndef;
  @Input() trmrkGoToParentBtnIsEnabled = true;
  @Input() trmrkColorLabelColor?: string | NullOrUndef;
  @Input() trmrkTrailingTemplate!: TemplateRef<any>;
  @Input() trmrkInputData: TInputData | NullOrUndef;

  TrmrkHorizStripType = TrmrkHorizStripType;

  constructor(public hostEl: ElementRef) {}

  ngOnDestroy(): void {
    this.trmrkLeadingBtnLongPressAltHost = null;
    this.trmrkGoToParentBtnLongPressAltHost = null;
    this.trmrkColorLabelBtnLongPressAltHost = null;
    this.trmrkTextLongPressAltHost = null;
    this.trmrkDetailsTextParts = null;
    this.trmrkLeadingIconTemplate = null;
    this.trmrkTrailingTemplate = null!;
    this.trmrkInputData = null;
  }
}
