import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, UrlTree, Router, UrlCreationOptions } from '@angular/router';
import { MatMenuModule, MatMenu, MatMenuTrigger } from '@angular/material/menu';

import { NullOrUndef, AnyOrUnknown } from '../../../../trmrk/core';

import {
  MouseButton,
  TouchOrMouseCoords,
  getSingleTouchOrClick,
  isAnyContainedBy,
} from '../../../../trmrk-browser/domUtils/touchAndMouseEvents';

import { whenChanged } from '../../../services/common/simpleChanges';
import { TrmrkUrl, TrmrkUrlType } from '../../../services/common/types';
import { TrmrkLongPressOrRightClick } from '../../../directives/trmrk-long-press-or-right-click';

@Component({
  selector: 'trmrk-app-link',
  imports: [CommonModule, RouterLink, MatMenuModule, TrmrkLongPressOrRightClick],
  templateUrl: './trmrk-app-link.html',
  styleUrl: './trmrk-app-link.scss',
})
export class TrmrkAppLink implements OnChanges, AfterViewInit {
  @Input() trmrkRouterLink!: TrmrkUrlType;
  @Input() trmrkCssClass?: string | string[] | NullOrUndef;
  @Input() trmrkShowOpenMenuBtn?: boolean | NullOrUndef;
  @Input() trmrkShowOpenInNewTabMenuBtn?: boolean | NullOrUndef;
  @Input() trmrkEnableShowInAnotherTabMenuBtn?: boolean | NullOrUndef;

  @Input() trmrkOpenInNewTabUrlTransformer?: ((routerLink: TrmrkUrl) => TrmrkUrl) | NullOrUndef;

  @Input() trmrkUrlEqualityComparer?:
    | ((routerLink: TrmrkUrl, refLink: TrmrkUrl) => boolean | AnyOrUnknown)
    | NullOrUndef;

  routerLink!: UrlTree;

  @ViewChild('ctxMenuTrigger', { read: MatMenuTrigger })
  ctxMenuTrigger!: MatMenuTrigger;

  @ViewChild('ctxMenu')
  ctxMenu!: MatMenu;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.ctxMenuTrigger.menu = this.ctxMenu;
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    whenChanged(
      changes,
      () => this.trmrkRouterLink,
      () => {
        let routerLink = this.trmrkRouterLink;

        if (((routerLink as string | string[]).length ?? null) !== null) {
          routerLink = {
            path: routerLink,
          } as TrmrkUrl;
        } else {
          routerLink = { ...(routerLink as TrmrkUrl) };
        }

        if ('string' === typeof routerLink.path) {
          routerLink.path = [routerLink.path];
        }

        let navigationExtras: UrlCreationOptions | undefined = undefined;

        if (routerLink.queryParams) {
          navigationExtras = {
            queryParams: routerLink.queryParams,
          };
        }

        this.routerLink = this.router.createUrlTree(routerLink.path as string[], navigationExtras);
      }
    );
  }

  anchorLongPressOrRightClick(event: TouchOrMouseCoords) {
    this.ctxMenuTrigger.openMenu();
  }
}
