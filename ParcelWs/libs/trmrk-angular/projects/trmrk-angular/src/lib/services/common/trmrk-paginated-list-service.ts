import { Injectable, ElementRef, QueryList, Injector, OnDestroy } from '@angular/core';

import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

export interface TrmrkPaginatedListServiceSetupArgs {}

@Injectable()
export class TrmrkPaginatedListService implements OnDestroy {
  ngOnDestroy(): void {}
}
