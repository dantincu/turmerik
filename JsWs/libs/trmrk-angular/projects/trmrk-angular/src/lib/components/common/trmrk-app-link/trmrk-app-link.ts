import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  ViewEncapsulation,
  ElementRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink, UrlTree, Router, UrlSerializer } from '@angular/router';
import { MatMenuModule, MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NullOrUndef, AnyOrUnknown } from '../../../../trmrk/core';
import { UserMessageLevel } from '../../../../trmrk/core';
import { TouchOrMouseCoords } from '../../../../trmrk-browser/domUtils/touchAndMouseEvents';
import { whenChanged } from '../../../services/common/simpleChanges';
import { TrmrkUrl, TrmrkUrlType } from '../../../services/common/types';

import {
  normalizeTrmrkUrl,
  trmrkUrlToNgUrlTree,
  serializeTrmrkUrl,
} from '../../../services/common/url';

import { TrmrkLongPressOrRightClick } from '../../../directives/trmrk-long-press-or-right-click';
import { TrmrkUserMessage } from '../trmrk-user-message/trmrk-user-message';
import { open_with } from '../../../assets/icons/material/open_with';
import { TrmrkAppLinkService } from '../../../services/common/trmrk-app-link-service';

@Component({
  selector: 'trmrk-app-link',
  imports: [
    CommonModule,
    RouterLink,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    TrmrkLongPressOrRightClick,
    TrmrkUserMessage,
  ],
  templateUrl: './trmrk-app-link.html',
  styleUrl: './trmrk-app-link.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TrmrkAppLink implements OnChanges, AfterViewInit {
  @Input() trmrkRouterLink!: TrmrkUrlType;
  @Input() trmrkCssClass?: string | string[] | NullOrUndef;
  @Input() trmrkLeadingTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkTrailingTemplate?: TemplateRef<any> | NullOrUndef;

  @Input() trmrkShowOpenMenuBtn?: boolean | NullOrUndef;

  @Input() trmrkShowOpenInNewTabMenuBtn?: boolean | NullOrUndef;
  @Input() trmrkOpenInNewTabUrlTransformer?: ((routerLink: TrmrkUrl) => TrmrkUrl) | NullOrUndef;

  @Input() trmrkShowOpenInNewBrowserTabMenuBtn?: boolean | NullOrUndef;

  @Input() trmrkOpenInNewBrowserTabUrlTransformer?:
    | ((routerLink: TrmrkUrl) => TrmrkUrl)
    | NullOrUndef;

  @Input() trmrkEnableShowInAnotherTabMenuBtn?: boolean | NullOrUndef;

  @Input() trmrkTabUrlsEqualityComparer?:
    | ((routerLink: TrmrkUrl, refLink: TrmrkUrl) => boolean | AnyOrUnknown)
    | NullOrUndef;

  @Input() trmrkShowCopyToClipboardMenuBtn?: boolean | NullOrUndef;
  @Input() trmrkShareableTabUrlTransformer?: ((routerLink: TrmrkUrl) => TrmrkUrl) | NullOrUndef;

  @Input() trmrkShowOpenExternallyMenuBtn?: boolean | NullOrUndef;
  @Input() trmrkExternalUrl?: string | NullOrUndef;

  UserMessageLevel = UserMessageLevel;

  @ViewChild('ctxMenuTrigger', { read: MatMenuTrigger })
  ctxMenuTrigger!: MatMenuTrigger;

  @ViewChild('ctxMenu')
  ctxMenu!: MatMenu;

  @ViewChild('copyToClipboardMenuItemAnchor') copyToClipboardMenuItemAnchor!: ElementRef<any>;

  open_with: SafeHtml;

  routerLink!: TrmrkUrl;
  openInNewTabRouterLink: TrmrkUrl | NullOrUndef;
  openInNewBrowserTabRouterLink: TrmrkUrl | NullOrUndef;
  shareableTabRouterLink: TrmrkUrl | NullOrUndef;

  ngRouterLink!: UrlTree;
  openInNewTabNgRouterLink: UrlTree | NullOrUndef;
  openInNewBrowserTabNgRouterLink: UrlTree | NullOrUndef;
  shareableTabNgRouterLink: UrlTree | NullOrUndef;

  showCopiedToClipboardSuccessMessage = 0;
  showCopiedToClipboardErrorMessage = 0;
  copiedToClipboardErrorMessage: string | null = null;
  copiedToClipboardMessageTopPx = 0;

  constructor(
    public appLinkService: TrmrkAppLinkService,
    private router: Router,
    private urlSerializer: UrlSerializer,
    private domSanitizer: DomSanitizer
  ) {
    this.open_with = domSanitizer.bypassSecurityTrustHtml(open_with);
  }

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
        this.updateRouterLink();
        this.updateOpenInNewTabRouterLink();
        this.updateOpenInNewBrowserTabRouterLink();
        this.updateShareableTabRouterLink();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkShowOpenInNewTabMenuBtn,
      () => {
        this.updateOpenInNewTabRouterLink();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkOpenInNewTabUrlTransformer,
      () => {
        this.updateOpenInNewTabRouterLink();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkShowOpenInNewBrowserTabMenuBtn,
      () => {
        this.updateOpenInNewBrowserTabRouterLink();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkOpenInNewBrowserTabUrlTransformer,
      () => {
        this.updateOpenInNewBrowserTabRouterLink();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkShowCopyToClipboardMenuBtn,
      () => {
        this.updateShareableTabRouterLink();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkShareableTabUrlTransformer,
      () => {
        this.updateShareableTabRouterLink();
      }
    );
  }

  anchorLongPressOrRightClick(event: TouchOrMouseCoords) {
    this.ctxMenuTrigger.openMenu();
  }

  async copyToClipboardClick(event: MouseEvent) {
    this.updateCopiedToClipboardMessageTopPx();
    const url = serializeTrmrkUrl(this.routerLink);

    try {
      await navigator.clipboard.writeText(url);
      this.showCopiedToClipboardSuccessMessage++;
    } catch (err) {
      this.showCopiedToClipboardErrorMessage++;
      this.copiedToClipboardErrorMessage = (err as Error)?.message;
    }
  }

  copyToClipboardSuccessMessageClosed() {
    this.showCopiedToClipboardSuccessMessage = 0;
  }

  copyToClipboardErrorMessageClosed() {
    this.showCopiedToClipboardErrorMessage = 0;
    this.copiedToClipboardErrorMessage = null;
  }

  updateRouterLink() {
    let routerLink = normalizeTrmrkUrl(this.trmrkRouterLink);
    this.routerLink = this.appLinkService.trmrkUrlNormalizer.normalizeTrmrkUrl(routerLink)!;
    this.ngRouterLink = trmrkUrlToNgUrlTree(this.routerLink, this.router);
  }

  updateOpenInNewTabRouterLink() {
    if (this.trmrkShowOpenInNewTabMenuBtn ?? true) {
      if (this.trmrkOpenInNewTabUrlTransformer) {
        this.openInNewTabRouterLink = this.trmrkOpenInNewTabUrlTransformer(this.routerLink);
      } else {
        this.openInNewTabRouterLink = this.getDefaultOpenInNewTabUrl(this.routerLink);
      }

      this.openInNewTabNgRouterLink = trmrkUrlToNgUrlTree(this.openInNewTabRouterLink, this.router);
    } else {
      this.openInNewTabRouterLink = null;
      this.openInNewTabNgRouterLink = null;
    }
  }

  updateOpenInNewBrowserTabRouterLink() {
    if (this.trmrkShowOpenInNewBrowserTabMenuBtn ?? true) {
      if (this.trmrkOpenInNewBrowserTabUrlTransformer) {
        this.openInNewBrowserTabRouterLink = this.trmrkOpenInNewBrowserTabUrlTransformer(
          this.routerLink
        );
      } else {
        this.openInNewBrowserTabRouterLink = this.getDefaultOpenInNewBrowserTabUrl(this.routerLink);
      }

      this.openInNewBrowserTabNgRouterLink = trmrkUrlToNgUrlTree(
        this.openInNewBrowserTabRouterLink,
        this.router
      );
    } else {
      this.openInNewBrowserTabRouterLink = null;
      this.openInNewBrowserTabNgRouterLink = null;
    }
  }

  updateShareableTabRouterLink() {
    if (this.trmrkShowCopyToClipboardMenuBtn ?? true) {
      if (this.trmrkShareableTabUrlTransformer) {
        this.shareableTabRouterLink = this.trmrkShareableTabUrlTransformer(this.routerLink);
      } else {
        this.shareableTabRouterLink = this.getDefaultShareableTabUrl(this.routerLink);
      }

      this.shareableTabNgRouterLink = trmrkUrlToNgUrlTree(this.shareableTabRouterLink, this.router);
    } else {
      this.shareableTabRouterLink = null;
      this.shareableTabNgRouterLink = null;
    }
  }

  getDefaultOpenInNewTabUrl(trmrkUrl: TrmrkUrl) {
    if (this.appLinkService.getDefaultOpenInNewTabUrl) {
      trmrkUrl = this.appLinkService.getDefaultOpenInNewTabUrl(trmrkUrl);
    }

    return trmrkUrl;
  }

  getDefaultOpenInNewBrowserTabUrl(trmrkUrl: TrmrkUrl) {
    if (this.appLinkService.getDefaultOpenInNewBrowserTabUrl) {
      trmrkUrl = this.appLinkService.getDefaultOpenInNewBrowserTabUrl(trmrkUrl);
    }

    return trmrkUrl;
  }

  getDefaultShareableTabUrl(trmrkUrl: TrmrkUrl) {
    if (this.appLinkService.getDefaultShareableTabUrl) {
      trmrkUrl = this.appLinkService.getDefaultShareableTabUrl(trmrkUrl);
    }

    return trmrkUrl;
  }

  updateCopiedToClipboardMessageTopPx() {
    this.copiedToClipboardMessageTopPx = (
      this.copyToClipboardMenuItemAnchor.nativeElement as HTMLElement
    ).parentElement!.parentElement!.offsetTop;
  }
}
