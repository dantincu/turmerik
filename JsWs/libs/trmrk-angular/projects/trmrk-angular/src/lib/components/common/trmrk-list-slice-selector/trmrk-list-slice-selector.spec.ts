import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkListSliceSelector } from './trmrk-list-slice-selector';

describe('TrmrkListSliceSelector', () => {
  let component: TrmrkListSliceSelector;
  let fixture: ComponentFixture<TrmrkListSliceSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkListSliceSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkListSliceSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
