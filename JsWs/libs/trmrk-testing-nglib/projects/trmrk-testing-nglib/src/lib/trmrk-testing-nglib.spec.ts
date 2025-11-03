import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkTestingNglib } from './trmrk-testing-nglib';

describe('TrmrkTestingNglib', () => {
  let component: TrmrkTestingNglib;
  let fixture: ComponentFixture<TrmrkTestingNglib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkTestingNglib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkTestingNglib);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
