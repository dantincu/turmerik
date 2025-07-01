import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ChangeDetectionStrategy,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgTemplateOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';

import { TrmrkLongPressOrRightClick } from '../directives/trmrk-long-press-or-right-click';

import {
  TrmrkHorizStrip,
  TrmrkHorizStripType,
  TrmrkHorizStripDetailsTextPart,
} from '../trmrk-horiz-strip/trmrk-horiz-strip';

import { TouchOrMouseCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';

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
  ],
  templateUrl: './trmrk-panel-list-item.html',
  styleUrl: './trmrk-panel-list-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrmrkPanelListItem implements AfterViewInit, OnDestroy {
  @Output() trmrkExpandedToggled = new EventEmitter<boolean>();
  @Output() trmrkCheckBoxToggled = new EventEmitter<MatCheckboxChange>();

  @Output() trmrkLeadingBtnLongPressOrRightClick =
    new EventEmitter<TouchOrMouseCoords>();

  @Output() trmrkLeadingBtnShortPressOrLeftClick =
    new EventEmitter<TouchOrMouseCoords>();

  @Output() trmrkLeadingIconBtnMouseDownOrTouchStart = new EventEmitter<
    MouseEvent | TouchEvent
  >();

  @Output()
  trmrkGoToParentBtnLongPressOrRightClick =
    new EventEmitter<TouchOrMouseCoords>();

  @Output() trmrkGoToParentBtnShortPressOrLeftClick =
    new EventEmitter<TouchOrMouseCoords>();

  @Output() trmrkColorLabelBtnLongPressOrRightClick =
    new EventEmitter<TouchOrMouseCoords>();

  @Output() trmrkColorLabelBtnShortPressOrLeftClick =
    new EventEmitter<TouchOrMouseCoords>();

  @Output() trmrkTextLongPressOrRightClick =
    new EventEmitter<TouchOrMouseCoords>();

  @Output() trmrkTextShortPressOrLeftClick =
    new EventEmitter<TouchOrMouseCoords>();

  @Input() trmrkIsAppBar = false;
  @Input() trmrkMainText!: string;
  @Input() trmrkDetailsTextParts:
    | (string | TrmrkHorizStripDetailsTextPart)[]
    | null = null;
  @Input() trmrkCssClass: string[] = [];
  @Input() trmrkIsExpandable?: boolean | null | undefined;
  @Input() trmrkIsExpanded = false;
  @Input() trmrkIsSelectable = false;
  @Input() trmrkIsSelected = false;
  @Input() trmrkLeadingMatIconName?: string | null | undefined;
  @Input() trmrkLeadingIconTemplate?: TemplateRef<any> | null | undefined;
  @Input() trmrkShowGoToParentBtn?: boolean | null | undefined;
  @Input() trmrkGoToParentMatIconName?: string | null | undefined;
  @Input() trmrkGoToParentBtnIsEnabled = true;
  @Input() trmrkColorLabelColor?: string | null | undefined;
  @Input() trmrkTrailingTemplate!: TemplateRef<any>;

  TrmrkHorizStripType = TrmrkHorizStripType;

  private leadingIconBtn: HTMLElement | null = null;

  constructor(private host: ElementRef) {
    this.leadingIconMouseDownOrTouchStart =
      this.leadingIconMouseDownOrTouchStart.bind(this);
  }

  ngAfterViewInit(): void {
    const hostEl = this.host.nativeElement as HTMLElement;
    this.leadingIconBtn = hostEl.querySelector('.trmrk-leading-icon-btn');

    if (this.leadingIconBtn) {
      this.leadingIconBtn.addEventListener(
        'mousedown',
        this.leadingIconMouseDownOrTouchStart
      );

      this.leadingIconBtn.addEventListener(
        'touchstart',
        this.leadingIconMouseDownOrTouchStart
      );
    }
  }

  ngOnDestroy(): void {
    if (this.leadingIconBtn) {
      this.leadingIconBtn.removeEventListener(
        'mousedown',
        this.leadingIconMouseDownOrTouchStart
      );

      this.leadingIconBtn.removeEventListener(
        'touchstart',
        this.leadingIconMouseDownOrTouchStart
      );

      this.leadingIconBtn = null;
    }
  }

  private leadingIconMouseDownOrTouchStart(event: MouseEvent | TouchEvent) {
    this.trmrkLeadingIconBtnMouseDownOrTouchStart.emit(event);
  }
}
