import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkFormFieldsPage } from './trmrk-form-fields-page';

describe('TrmrkFormFieldsPage', () => {
  let component: TrmrkFormFieldsPage;
  let fixture: ComponentFixture<TrmrkFormFieldsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkFormFieldsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkFormFieldsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
