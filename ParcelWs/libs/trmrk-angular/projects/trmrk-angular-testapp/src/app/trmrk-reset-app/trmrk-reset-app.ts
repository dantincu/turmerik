import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { TrmrkLoading } from 'trmrk-angular';

import { jsonBool } from '../../trmrk/core';

@Component({
  selector: 'app-trmrk-reset-app',
  imports: [TrmrkLoading, RouterLink, MatIconModule, CommonModule],
  templateUrl: './trmrk-reset-app.html',
  styleUrl: './trmrk-reset-app.scss',
})
export class TrmrkResetApp implements OnInit, OnDestroy {
  isResetting = false;
  private routeSub: Subscription;

  constructor(private route: ActivatedRoute) {
    this.routeSub = this.route.queryParamMap.subscribe((params) => {
      this.isResetting = params.get('reset') === jsonBool.true; // Check if the 'reset' query param is set to true

      if (this.isResetting) {
        setTimeout(() => {
          localStorage.clear(); // Clear local storage

          window.location.href = '/reset-app';
        }, 0);
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
