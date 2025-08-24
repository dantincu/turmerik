import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { companies } from './services/companies';
import { Entity } from './services/types';
import { Item } from './item/item';

const appThemeIsDarkModeLocalStorageKey = 'appThemeIsDarkMode';
const defaultCount = 4;

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [CommonModule, Item],
})
export class App implements OnDestroy, AfterViewInit {
  isDarkMode =
    localStorage.getItem(appThemeIsDarkModeLocalStorageKey) === 'true';

  archEntity: Entity = {
    idx: 0,
    name: '@@@archive@@@',
    isChecked: false,
    isCurrent: false,
  };

  entities: Entity[] = companies.slice(0, 1000).map((name, idx) => ({
    idx,
    name,
    isChecked: false,
    isCurrent: false,
  }));

  count = defaultCount;
  idxes!: number[];

  sectionCats = [
    'primary-section',
    'secondary-section',
    'ternary-section',
    'note',
    'folder',
    'file',
  ];

  private routeSub: Subscription;

  constructor(private route: ActivatedRoute) {
    this.updateIdxes();

    this.routeSub = this.route.queryParamMap.subscribe((params) => {
      const countParam = params.get('count');

      if (countParam) {
        this.count = parseInt(countParam);
      } else {
        this.count = defaultCount;
      }

      this.updateIdxes();
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  ngAfterViewInit(): void {
    const win = window as any;

    if (win.trmrkInit) {
      win.trmrkInit();
    }
  }

  isDarkModeToggled() {
    this.isDarkMode = !this.isDarkMode;

    localStorage.setItem(
      appThemeIsDarkModeLocalStorageKey,
      this.isDarkMode ? 'true' : 'false'
    );
  }

  itemToggled(idx: number) {
    if (idx >= 0) {
      const compn = this.entities[idx];
      compn.isChecked = !compn.isChecked;
    } else {
      this.archEntity.isChecked = !this.archEntity.isChecked;
    }
  }

  itemClicked(idx: number) {
    for (let i = 0; i < this.entities.length; i++) {
      if (i === idx) {
        this.entities[i].isCurrent = true;
        this.entities[i] = { ...this.entities[i] };
      } else {
        this.entities[i].isCurrent = false;
      }
    }

    if (idx < 0) {
      this.archEntity.isCurrent = true;
      this.archEntity = { ...this.archEntity };
    } else if (this.archEntity.isCurrent) {
      this.archEntity.isCurrent = false;
      this.archEntity = { ...this.archEntity };
    }
  }

  private updateIdxes() {
    this.idxes = Array(this.count)
      .fill(0)
      .map((_, i) => i);
  }
}
