import { Component, Input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink, UrlTree } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'trmrk-app-bar',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatIconButton,
    RouterLink,
    MatMenuModule,
    NgTemplateOutlet,
  ],
  templateUrl: './trmrk-app-bar.html',
  styleUrl: './trmrk-app-bar.scss',
})
export class TrmrkAppBar {
  @Input() trmrkLeadingIconTemplate?: TemplateRef<any> | null | undefined;
  @Input() trmrkTrailingIconTemplate?: TemplateRef<any> | null | undefined;
  @Input() trmrkHomeRouterLink:
    | string
    | readonly any[]
    | UrlTree
    | null
    | undefined = ['/'];
  @Input() trmrkTitle!: string;
}
