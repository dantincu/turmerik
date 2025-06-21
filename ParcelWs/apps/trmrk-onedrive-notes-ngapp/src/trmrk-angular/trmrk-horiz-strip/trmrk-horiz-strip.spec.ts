import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkHorizStrip } from './trmrk-horiz-strip';

describe('TrmrkHorizStrip', () => {
  let component: TrmrkHorizStrip;
  let fixture: ComponentFixture<TrmrkHorizStrip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkHorizStrip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkHorizStrip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
