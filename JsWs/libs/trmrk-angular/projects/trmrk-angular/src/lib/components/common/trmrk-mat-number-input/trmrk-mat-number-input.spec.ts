import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkMatNumberInput } from './trmrk-mat-number-input';

describe('TrmrkMatNumberInput', () => {
  let component: TrmrkMatNumberInput;
  let fixture: ComponentFixture<TrmrkMatNumberInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkMatNumberInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkMatNumberInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
