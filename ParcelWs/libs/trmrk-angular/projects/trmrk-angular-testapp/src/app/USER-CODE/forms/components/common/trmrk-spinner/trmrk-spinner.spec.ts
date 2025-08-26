import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkSpinner } from './trmrk-spinner';

describe('TrmrkSpinner', () => {
  let component: TrmrkSpinner;
  let fixture: ComponentFixture<TrmrkSpinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkSpinner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkSpinner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
