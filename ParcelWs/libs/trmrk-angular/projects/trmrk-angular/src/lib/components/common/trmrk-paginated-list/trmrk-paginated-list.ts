import {
  Component,
  Input,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
  TemplateRef,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';

import { whenChanged } from '../../../services/common/simpleChanges';

import { NullOrUndef } from '../../../../trmrk/core';

import {
  TrmrkPaginatedListService,
  TrmrkPaginatedListServiceSetupArgs,
} from '../../../services/common/trmrk-paginated-list-service';

@Component({
  selector: 'trmrk-paginated-list',
  imports: [],
  templateUrl: './trmrk-paginated-list.html',
  styleUrl: './trmrk-paginated-list.scss',
})
export class TrmrkPaginatedList {
  constructor(
    public paginatedListService: TrmrkPaginatedListService,
    private sanitizer: DomSanitizer
  ) {}
}
