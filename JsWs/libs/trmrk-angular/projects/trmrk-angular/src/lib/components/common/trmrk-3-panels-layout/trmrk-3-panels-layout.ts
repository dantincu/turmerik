import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenu, MatMenuTrigger } from '@angular/material/menu';

import { NullOrUndef } from '../../../../trmrk/core';
import { AppServiceBase } from '../../../services/common/app-service-base';
import { ComponentIdService } from '../../../services/common/component-id-service';
import { IntIdMappedAppPanelsLayoutServiceFactory } from '../../../services/common/int-id-mapped-app-panels-layout-service-factory';

import {
  AppPanelsLayoutService,
  PanelPosition,
} from '../../../services/common/app-panels-layout-service';

import { TrmrkHorizStrip } from '../trmrk-horiz-strip/trmrk-horiz-strip';
import { TrmrkDrag } from '../../../directives/trmrk-drag';
import { TrmrkLongPressOrRightClick } from '../../../directives/trmrk-long-press-or-right-click';
import { drag_pan } from '../../../assets/icons/material/drag_pan';
import { recenter } from '../../../assets/icons/material/recenter';
import { left_panel_open } from '../../../assets/icons/material/left_panel_open';
import { right_panel_open } from '../../../assets/icons/material/right_panel_open';
import { top_panel_open } from '../../../assets/icons/material/top_panel_open';
import { TrmrkTouchStartOrMouseDown } from '../../../directives/trmrk-touch-start-or-mouse-down';

@Component({
  selector: 'trmrk-3-panels-layout',
  imports: [
    CommonModule,
    NgTemplateOutlet,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    TrmrkHorizStrip,
    TrmrkDrag,
    TrmrkTouchStartOrMouseDown,
    TrmrkLongPressOrRightClick,
  ],
  templateUrl: './trmrk-3-panels-layout.html',
  styleUrl: './trmrk-3-panels-layout.scss',
})
export class Trmrk3PanelsLayout implements OnDestroy {
  static dfCssClass = 'trmrk-3-panels-layout';
  static dfPanelWidthRatios = [33333, 33333, 33333];

  @Input() trmrkLayoutKey?: string | NullOrUndef;

  @Input() trmrkLeftPanelTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkLeftPanelOptionsMenuTemplate?: TemplateRef<any> | NullOrUndef;

  @Input() trmrkMiddlePanelTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkMiddlePanelOptionsMenuTemplate?: TemplateRef<any> | NullOrUndef;

  @Input() trmrkRightPanelTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkRightPanelOptionsMenuTemplate?: TemplateRef<any> | NullOrUndef;

  PanelPosition = PanelPosition;

  id: number;
  service: AppPanelsLayoutService;

  drag_pan: SafeHtml;
  recenter: SafeHtml;
  left_panel_open: SafeHtml;
  right_panel_open: SafeHtml;
  top_panel_open: SafeHtml;

  basePanelWidthRatios = Trmrk3PanelsLayout.dfPanelWidthRatios;
  panelWidthRatios = Trmrk3PanelsLayout.dfPanelWidthRatios;

  @ViewChild('containerEl') containerEl!: ElementRef<any>;
  @ViewChild('leftPanelEl') leftPanelEl!: ElementRef<any>;
  @ViewChild('rightPanelEl') rightPanelEl!: ElementRef<any>;

  @ViewChild('leftPanelOptionsMenu', { read: MatMenu }) leftPanelOptionsMenu!: MatMenu;

  @ViewChild('leftPanelOptionsMenuTrigger', { read: MatMenuTrigger })
  leftPanelOptionsMenuTrigger!: MatMenuTrigger;

  @ViewChild('middlePanelOptionsMenu', { read: MatMenu }) middlePanelOptionsMenu!: MatMenu;

  @ViewChild('middlePanelOptionsMenuTrigger', { read: MatMenuTrigger })
  middlePanelOptionsMenuTrigger!: MatMenuTrigger;

  @ViewChild('rightPanelOptionsMenu', { read: MatMenu }) rightPanelOptionsMenu!: MatMenu;

  @ViewChild('rightPanelOptionsMenuTrigger', { read: MatMenuTrigger })
  rightPanelOptionsMenuTrigger!: MatMenuTrigger;

  @ViewChild('resizeLeftPanelStrip') resizeLeftPanelStrip?: ElementRef<HTMLElement> | NullOrUndef;
  @ViewChild('resizeRightPanelStrip') resizeRightPanelStrip?: ElementRef<HTMLElement> | NullOrUndef;

  constructor(
    private appService: AppServiceBase,
    private domSanitizer: DomSanitizer,
    private componentIdService: ComponentIdService,
    private intIdMappedAppPanelLayoutServiceFactory: IntIdMappedAppPanelsLayoutServiceFactory
  ) {
    this.drag_pan = domSanitizer.bypassSecurityTrustHtml(drag_pan);
    this.recenter = domSanitizer.bypassSecurityTrustHtml(recenter);
    this.left_panel_open = domSanitizer.bypassSecurityTrustHtml(left_panel_open);
    this.right_panel_open = domSanitizer.bypassSecurityTrustHtml(right_panel_open);
    this.top_panel_open = domSanitizer.bypassSecurityTrustHtml(top_panel_open);
    this.leftPanelVisibilityChanged = this.leftPanelVisibilityChanged.bind(this);
    this.middlePanelVisibilityChanged = this.middlePanelVisibilityChanged.bind(this);
    this.rightPanelVisibilityChanged = this.rightPanelVisibilityChanged.bind(this);

    this.id = componentIdService.getNextId();
    this.service = intIdMappedAppPanelLayoutServiceFactory.getOrCreate(this.id);

    this.service.alwaysRenderLeftPanelChanged.subscribe(this.leftPanelVisibilityChanged);
    this.service.showLeftPanelChanged.subscribe(this.leftPanelVisibilityChanged);

    this.service.alwaysRenderMiddlePanelChanged.subscribe(this.middlePanelVisibilityChanged);
    this.service.showMiddlePanelChanged.subscribe(this.middlePanelVisibilityChanged);

    this.service.alwaysRenderRightPanelChanged.subscribe(this.rightPanelVisibilityChanged);
    this.service.showRightPanelChanged.subscribe(this.rightPanelVisibilityChanged);

    setTimeout(() => {
      this.service.setup({
        layoutKey: this.trmrkLayoutKey,
        containerEl: () => this.containerEl,
        leftPanelEl: () => this.leftPanelEl,
        leftPanelOptionsMenu: () => this.leftPanelOptionsMenu,
        leftPanelOptionsMenuTrigger: () => this.leftPanelOptionsMenuTrigger,
        middlePanelOptionsMenu: () => this.middlePanelOptionsMenu,
        middlePanelOptionsMenuTrigger: () => this.middlePanelOptionsMenuTrigger,
        resizeLeftPanelStrip: () => this.resizeLeftPanelStrip,
        resizeRightPanelStrip: () => this.resizeRightPanelStrip,
        rightPanelEl: () => this.rightPanelEl,
        rightPanelOptionsMenu: () => this.rightPanelOptionsMenu,
        rightPanelOptionsMenuTrigger: () => this.rightPanelOptionsMenuTrigger,
      });
    });
  }

  ngOnDestroy(): void {
    this.intIdMappedAppPanelLayoutServiceFactory.clear(this.id);
  }

  leftPanelVisibilityChanged(_: boolean) {
    setTimeout(() => {
      if (this.leftPanelOptionsMenuTrigger) {
        this.leftPanelOptionsMenuTrigger.menu = this.leftPanelOptionsMenu;
      }
    });
  }

  middlePanelVisibilityChanged(_: boolean) {
    setTimeout(() => {
      if (this.middlePanelOptionsMenuTrigger) {
        this.middlePanelOptionsMenuTrigger.menu = this.middlePanelOptionsMenu;
      }
    });
  }

  rightPanelVisibilityChanged(_: boolean) {
    setTimeout(() => {
      if (this.rightPanelOptionsMenuTrigger) {
        this.rightPanelOptionsMenuTrigger.menu = this.rightPanelOptionsMenu;
      }
    });
  }
}
