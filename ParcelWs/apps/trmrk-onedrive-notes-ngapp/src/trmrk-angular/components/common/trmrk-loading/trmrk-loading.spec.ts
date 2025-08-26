import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkLoading } from './trmrk-loading';

describe('TrmrkLoading', () => {
  let component: TrmrkLoading;
  let fixture: ComponentFixture<TrmrkLoading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkLoading]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkLoading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
