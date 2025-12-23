import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkMatRgbInput } from './trmrk-mat-rgb-input';

describe('TrmrkMatRgbInput', () => {
  let component: TrmrkMatRgbInput;
  let fixture: ComponentFixture<TrmrkMatRgbInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkMatRgbInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkMatRgbInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
