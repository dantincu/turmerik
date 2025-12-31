import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkInfiniteHeightPanelScrollControl } from './trmrk-infinite-height-panel-scroll-control';

describe('TrmrkInfiniteHeightPanelScrollControl', () => {
  let component: TrmrkInfiniteHeightPanelScrollControl;
  let fixture: ComponentFixture<TrmrkInfiniteHeightPanelScrollControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkInfiniteHeightPanelScrollControl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkInfiniteHeightPanelScrollControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
