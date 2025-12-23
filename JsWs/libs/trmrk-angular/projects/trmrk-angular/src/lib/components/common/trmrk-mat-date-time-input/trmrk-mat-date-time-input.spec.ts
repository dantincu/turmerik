import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkMatDateTimeInput } from './trmrk-mat-date-time-input';

describe('TrmrkMatDateTimeInput', () => {
  let component: TrmrkMatDateTimeInput;
  let fixture: ComponentFixture<TrmrkMatDateTimeInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkMatDateTimeInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkMatDateTimeInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
