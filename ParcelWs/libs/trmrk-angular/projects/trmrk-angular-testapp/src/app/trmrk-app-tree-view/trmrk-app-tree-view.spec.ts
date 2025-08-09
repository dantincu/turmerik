import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkAppTreeView } from './trmrk-app-tree-view';

describe('TrmrkTreeView', () => {
  let component: TrmrkAppTreeView;
  let fixture: ComponentFixture<TrmrkAppTreeView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkAppTreeView],
    }).compileComponents();

    fixture = TestBed.createComponent(TrmrkAppTreeView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
