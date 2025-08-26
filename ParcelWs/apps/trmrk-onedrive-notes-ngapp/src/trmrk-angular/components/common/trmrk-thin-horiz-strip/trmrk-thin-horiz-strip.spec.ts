import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkThinHorizStrip } from './trmrk-thin-horiz-strip';

describe('TrmrkThinHorizStrip', () => {
  let component: TrmrkThinHorizStrip;
  let fixture: ComponentFixture<TrmrkThinHorizStrip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkThinHorizStrip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkThinHorizStrip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
