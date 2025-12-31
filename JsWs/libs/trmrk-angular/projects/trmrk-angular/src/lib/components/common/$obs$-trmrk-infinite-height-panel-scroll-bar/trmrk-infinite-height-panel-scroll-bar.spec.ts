import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkInfiniteHeightPanelScrollBar } from './trmrk-infinite-height-panel-scroll-bar';

describe('TrmrkInfiniteHeightPanelScrollBar', () => {
  let component: TrmrkInfiniteHeightPanelScrollBar;
  let fixture: ComponentFixture<TrmrkInfiniteHeightPanelScrollBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkInfiniteHeightPanelScrollBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkInfiniteHeightPanelScrollBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
