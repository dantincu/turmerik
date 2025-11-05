import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkInfiniteHeightPanelTestPage } from './trmrk-infinite-height-panel-test-page';

describe('TrmrkInfiniteHeightPanelTestPage', () => {
  let component: TrmrkInfiniteHeightPanelTestPage;
  let fixture: ComponentFixture<TrmrkInfiniteHeightPanelTestPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkInfiniteHeightPanelTestPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkInfiniteHeightPanelTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
