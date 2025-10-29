import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrmrkFormsTestPage } from './trmrk-forms-test-page';

describe('TrmrkFormsTestPage', () => {
  let component: TrmrkFormsTestPage;
  let fixture: ComponentFixture<TrmrkFormsTestPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrmrkFormsTestPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrmrkFormsTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
