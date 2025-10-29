import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkAcceleratingScrollControl } from './trmrk-accelerating-scroll-control';

describe('TrmrkAcceleratingScrollControl', () => {
  let component: TrmrkAcceleratingScrollControl;
  let fixture: ComponentFixture<TrmrkAcceleratingScrollControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkAcceleratingScrollControl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkAcceleratingScrollControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
