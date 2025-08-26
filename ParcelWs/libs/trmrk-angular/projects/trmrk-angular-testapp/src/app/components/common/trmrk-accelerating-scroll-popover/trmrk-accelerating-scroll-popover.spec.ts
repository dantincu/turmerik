import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkAcceleratingScrollPopover } from './trmrk-accelerating-scroll-popover';

describe('TrmrkAcceleratingScrollPopover', () => {
  let component: TrmrkAcceleratingScrollPopover;
  let fixture: ComponentFixture<TrmrkAcceleratingScrollPopover>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkAcceleratingScrollPopover]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkAcceleratingScrollPopover);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
