import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkForm } from './trmrk-form';

describe('TrmrkForm', () => {
  let component: TrmrkForm;
  let fixture: ComponentFixture<TrmrkForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
