import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  EventEmitter,
  Output,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';

import { NgTemplateOutlet, CommonModule } from '@angular/common';
import { RouterLink, UrlTree } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'trmrk-app-bar',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatIconButton,
    RouterLink,
    MatMenuModule,
    NgTemplateOutlet,
  ],
  templateUrl: './trmrk-app-bar.html',
  styleUrl: './trmrk-app-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrmrkAppBar implements AfterViewInit {
  @Output() trmrkPageTitleElem = new EventEmitter<HTMLHeadingElement>();
  @Input() trmrkLeadingIconTemplate?: TemplateRef<any> | null | undefined;
  @Input() trmrkTrailingTemplate?: TemplateRef<any> | null | undefined;
  @Input() trmrkHomeRouterLink:
    | string
    | readonly any[]
    | UrlTree
    | null
    | undefined = ['/'];
  @Input() trmrkTitle!: string;
  @Input() trmrkCssClass: string | null = null;

  @ViewChild('pageTitle', { read: ElementRef })
  pageTitle!: ElementRef;

  constructor(public hostEl: ElementRef) {}

  ngAfterViewInit(): void {
    this.trmrkPageTitleElem.emit(this.pageTitle.nativeElement);
  }
}
