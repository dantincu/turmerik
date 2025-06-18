import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkItemStrip } from './trmrk-item-strip';

describe('TrmrkItemStrip', () => {
  let component: TrmrkItemStrip;
  let fixture: ComponentFixture<TrmrkItemStrip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkItemStrip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkItemStrip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
