import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkFormRow } from './trmrk-form-row';

describe('TrmrkFormRow', () => {
  let component: TrmrkFormRow;
  let fixture: ComponentFixture<TrmrkFormRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkFormRow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkFormRow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
